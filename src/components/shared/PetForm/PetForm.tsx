import { CountryDropDown, CustomInputField, CustomMultiSelect, CustomTextArea } from '@/components/common';
import { addPet, updatePet } from '@/lib/api';
import { IImageFile, IPet } from '@/types/types';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { FiCheck, FiInfo } from 'react-icons/fi';
import { mutate } from 'swr';
import * as Yup from 'yup';
import PetImageSelector from '../PetImageSelector';

interface IFormState {
  name: string;
  species: string;
  age: number;
  poddy_trained?: boolean;
  diet?: string[];
  likes?: string[];
  dislikes?: string[];
}

interface IProps {
  title: string;
  petForm: Partial<IPet>;
  forNewPet: boolean;
  formId: string;
}

const PetFormSchema = Yup.object().shape({
  name: Yup.string().required('Pet name is required.'),
  species: Yup.string().required('Species is required.'),
  age: Yup.number(),
  breed: Yup.string(),
  image: Yup.object(),
  description: Yup.string(),
  images: Yup.array(Yup.object()),
  poddy_trained: Yup.boolean(),
  diet: Yup.array(Yup.string()),
  likes: Yup.array(Yup.string()),
  dislikes: Yup.array(Yup.string())
});

const toObjectArray = (arr: any[]) => arr.map(val => ({ value: val, label: val }));

const PetForm: FC<IProps> = ({ formId, petForm, forNewPet = true, title }) => {
  const router = useRouter();
  const [isSuccess, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<IImageFile[]>(() => {
    // concat image and images array and map necessary properties
    const initFiles = petForm.image ? [petForm.image, ...petForm.images] : petForm.images;
    return initFiles.map((img: any) => ({
      type: 'upload',
      file: null,
      url: img?.url,
      isThumbnail: false,
      id: img?.public_id,
      raw: img
    }))
  });

  const initFormikValues = {
    name: petForm.name,
    species: petForm.species,
    breed: petForm.breed,
    country: petForm.country || { value: 'PH', label: 'Philippines' },
    age: petForm.age,
    image: petForm.image,
    images: petForm.images,
    poddy_trained: petForm.poddy_trained,
    diet: petForm.diet,
    likes: petForm.likes,
    description: petForm?.description || '',
    dislikes: petForm.dislikes,
  }

  const handleSubmit = async (values: IFormState) => {
    const formData = new FormData();

    //validate if a thumbnail exists
    if ((!imageFiles.some(img => img.isThumbnail) && imageFiles.length > 1)) {
      return;
    }

    if (imageFiles.length === 0) return setError('Pet image is required.');

    const jsonProp: any = {};
    // Append props of type 'object' to jsonProp so that the server can only parse 
    // this property one time without having to manually parse individual prop

    for (const [key, value] of Object.entries(values)) {
      if (typeof value === 'object') { // arrays are also of type object
        jsonProp[key] = value;
      } else {
        // append only non-object props 
        formData.append(key, value);
      }
    }

    // append files to formData
    imageFiles
      .forEach((img) => {
        if (img.isThumbnail || imageFiles.length === 1) { // if the image is thumbnail
          if (img.file) { // if file exists - Let's upload it 
            formData.append('image', img.file);
          } else {
            // make sure no duplicate of thumbnail in images array
            const filtered = imageFiles
              .filter(image => image.id !== img.id)
              .map(image => image.raw);
            //overwrite the image and images prop on jsonProp 
            jsonProp.images = filtered;
            jsonProp.image = img.raw;
          }
        } else {
          // the image will be appended on imageFiles [] to be uploaded
          // make sure we're appending a file and not 'null'
          img.file && formData.append('imageFiles', img.file);
        }
      });

    // append the stringified jsonProp to formData
    formData.append('jsonProp', JSON.stringify(jsonProp));

    try {
      setError('');
      setSuccess(false);

      if (forNewPet) {
        await addPet(formData);

        router.push('/');
      } else {
        const { id } = router.query;
        const data = await updatePet(id as string, formData);

        mutate(`/api/pets/${id}`, { data }, false); // Update the local data without a revalidation
      }

      setSuccess(true);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  }

  return (
    <div>
      <div>
        {error && <span className="p-2 text-red-500 bg-red-100 block">{error}</span>}
        <h1 className="text-gray-800 text-2xl laptop:text-4xl">{title}</h1>
      </div>
      <p className="text-gray-500 flex items-center">
        <FiInfo /> &nbsp;
        Labels with <strong style={{ color: 'var(--primary)' }}>*</strong> are required.
      </p>
      <br /><br /><br />
      <Formik
        validationSchema={PetFormSchema}
        initialValues={initFormikValues}
        validateOnChange
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form id={formId}>
            <div className="flex flex-col laptop:flex-row">
              <div className="laptop:flex-basis-30 order-2 laptop:order-1">
                <PetImageSelector
                  setImageFiles={setImageFiles}
                  imageFiles={imageFiles}
                  isSubmitting={isSubmitting}
                />
              </div>
              <div className="laptop:pl-12 space-y-4 laptop:flex-basis-70 order-1 laptop:order-2">
                <div className="w-full laptop:grid laptop:grid-cols-2 laptop:gap-4 space-y-4 laptop:space-y-0">
                  <Field disabled={isSubmitting} name="name" component={CustomInputField} label="* Pet Name" />
                  <Field disabled={isSubmitting} name="breed" component={CustomInputField} label="Breed" />
                </div>
                <div className="w-full laptop:grid laptop:grid-cols-2 laptop:gap-4 space-y-4 laptop:space-y-0">
                  <Field disabled={isSubmitting} name="species" component={CustomInputField} label="* Species" />
                  <Field disabled={isSubmitting} type="number" name="age" component={CustomInputField} label="Age" />
                </div>
                <div className="w-full laptop:grid laptop:grid-cols-2 laptop:gap-4 space-y-4 laptop:space-y-0 items-center">
                  {/* --- CUSTOM CHECKBOX */}
                  <div>
                    <label htmlFor="poddy_trained" className="inline-flex items-center mt-3 cursor-pointer">
                      <Field
                        className="form-checkbox h-4 w-4"
                        disabled={isSubmitting}
                        type="checkbox"
                        id="poddy_trained"
                        name="poddy_trained"
                      />
                      <span className="ml-2 text-gray-700">Poddy Trained</span>
                    </label>
                  </div>
                  <Field>
                    {({ form, meta }) => (
                      <div>
                        <label className="label" htmlFor="country">Country</label>
                        <CountryDropDown
                          selected={form.values.country}
                          defaultValue={form.values.country}
                          disabled={isSubmitting}
                          onChange={(val) => form.setValues(((vals: IFormState) => ({ ...vals, country: val })))}
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <Field
                  disabled={isSubmitting}
                  name="description"
                  component={CustomTextArea}
                  rows={7}
                  label="Short description about your pet"
                  placeholder="Pet description"
                />
                <CustomMultiSelect
                  defaultValues={toObjectArray(petForm.likes)}
                  name="likes"
                  iid="likes"
                  options={toObjectArray(petForm.likes)}
                  disabled={isSubmitting}
                  placeholder="Select/Create likes"
                  label="Likes"
                />
                <CustomMultiSelect
                  defaultValues={toObjectArray(petForm.dislikes)}
                  name="dislikes"
                  options={toObjectArray(petForm.dislikes)}
                  iid="dislikes"
                  disabled={isSubmitting}
                  placeholder="Select/Create dislikes"
                  label="Dislikes"
                />
                <CustomMultiSelect
                  defaultValues={toObjectArray(petForm.diet)}
                  name="Diet"
                  iid="diet"
                  disabled={isSubmitting}
                  options={toObjectArray(petForm.diet)}
                  placeholder="Select/Create diet"
                  label="Diet"
                />
              </div>
            </div>
            <div className="order-3 mt-8 flex justify-end items-center flex-col laptop:flex-row laptop:space-x-2 space-y-2">
              {isSuccess && !forNewPet && (
                <span className="text-accent-1-600 p-2 bg-accent-1-200 w-full laptop:w-auto flex items-center">
                  <FiCheck /> Pet details updated successfully!
                </span>
              )}
              <button
                className="flex w-full laptop:w-auto items-center justify-center"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? <AiOutlineLoading className="spin" /> : <FiCheck />}
                &nbsp;
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>

  )
}

export default PetForm

import { CountryDropDown, CustomInputField, CustomMultiSelect } from '@/components/common';
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
import styles from './PetForm.module.scss';

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
  images: Yup.array(Yup.object()),
  poddy_trained: Yup.boolean(),
  diet: Yup.array(Yup.string()),
  likes: Yup.array(Yup.string()),
  dislikes: Yup.array(Yup.string())
});

const toObjectArray = (arr: any[]) => arr.map(val => ({ value: val, label: val }));

const PetForm: FC<IProps> = ({ formId, petForm, forNewPet = true, title }) => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
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

      if (forNewPet) {
        await addPet(formData);

        router.push('/');
      } else {
        const { id } = router.query;
        const data = await updatePet(id as string, formData);
        mutate(`/api/pets/${id}`, data, false); // Update the local data without a revalidation

        alert('Success');
      }
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div>
      <div>
        {error && <span className="msg--error">{error}</span>}
        <h1>{title}</h1>
      </div>
      <p className="text-subtle">
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
          <Form id={formId} className={styles.form}>
            <div className={styles.images}>
              <PetImageSelector
                setImageFiles={setImageFiles}
                imageFiles={imageFiles}
                isSubmitting={isSubmitting}
              />
            </div>
            <div className={styles.form_fields}>
              <div className={styles.flex_field}>
                <Field disabled={isSubmitting} name="name" component={CustomInputField} label="* Pet Name" />
                <Field disabled={isSubmitting} name="breed" component={CustomInputField} label="Breed" />
              </div>
              <div className={styles.flex_field}>
                <Field disabled={isSubmitting} name="species" component={CustomInputField} label="* Species" />
                <Field disabled={isSubmitting} type="number" name="age" component={CustomInputField} label="Age" />
              </div>
              <div className={`${styles.flex_field} ${styles.checkbox_container}`}>
                {/* --- CUSTOM CHECKBOX */}
                <div className={styles.checkbox_wrapper}>
                  <label className={styles.checkbox}>
                    Poddy Trained
                  <Field disabled={isSubmitting} type="checkbox" id="poddy_trained" name="poddy_trained" />
                    <span className={styles.checkmark}></span>
                  </label>
                </div>
                <Field>
                  {({ form, meta }) => (
                    <div className="input-fieldset">
                      <label className="label" htmlFor="country">Country</label>
                      <CountryDropDown
                        selected={form.values.country}
                        defaultValue={form.values.country}
                        disabled={isSubmitting}
                        onChange={(val) => form.setValues(((vals: IFormState) => ({ ...vals, country: val })))}
                      />
                    </div>
                  )
                  }
                </Field>
              </div>
              <CustomMultiSelect
                defaultValues={toObjectArray(petForm.likes)}
                name="likes"
                iid="likes"
                options={toObjectArray(petForm.likes)}
                disabled={isSubmitting}
                placeholder=""
                label="Likes"
              />
              <CustomMultiSelect
                defaultValues={toObjectArray(petForm.dislikes)}
                name="dislikes"
                options={toObjectArray(petForm.dislikes)}
                iid="dislikes"
                disabled={isSubmitting}
                placeholder=""
                label="Dislikes"
              />
              <CustomMultiSelect
                defaultValues={toObjectArray(petForm.diet)}
                name="Diet"
                iid="diet"
                disabled={isSubmitting}
                options={toObjectArray(petForm.diet)}
                placeholder=""
                label="Diet"
              />
              <div>
                <button
                  className="btn button--icon"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? <AiOutlineLoading className="spin" /> : <FiCheck />}
                  &nbsp;
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>

  )
}

export default PetForm

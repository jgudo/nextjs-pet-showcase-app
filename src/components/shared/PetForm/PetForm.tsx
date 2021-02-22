import { CustomInputField, CustomMultiSelect } from '@/components/common';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { mutate } from 'swr';
import * as Yup from 'yup';
import styles from './PetForm.module.scss';

interface IFormState {
  name: string;
  species: string;
  age: number;
  poddy_trained?: boolean;
  diet?: string[];
  image_url: string;
  likes?: string[];
  dislikes?: string[];
}

const PetFormSchema = Yup.object().shape({
  name: Yup.string().required('Pet name is required.'),
  species: Yup.string().required('Species is required.'),
  age: Yup.number(),
  breed: Yup.string(),
  poddy_trained: Yup.boolean(),
  diet: Yup.array(Yup.string()),
  image_url: Yup.string().required('Image url is required.'),
  likes: Yup.array(Yup.string()),
  dislikes: Yup.array(Yup.string())
});

const PetForm = ({ formId, petForm, forNewPet = true }) => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const options = useMemo(() => countryList().getData(), []);

  const initFormikValues = {
    name: petForm.name,
    species: petForm.species,
    breed: petForm.breed,
    country: petForm.country || { value: 'PH', label: 'Philippines' },
    age: petForm.age,
    poddy_trained: petForm.poddy_trained,
    diet: petForm.diet,
    image_url: petForm.image_url,
    likes: petForm.likes,
    dislikes: petForm.dislikes,
  }

  const putData = async (form) => {
    const { id } = router.query

    try {
      const res: Response = await fetch(`/api/pets/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(String(res.status))
      }

      const { data } = await res.json()

      mutate(`/api/pets/${id}`, data, false) // Update the local data without a revalidation
      router.push('/')
    } catch (error) {
      setMessage('Failed to update pet')
    }
  }

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(String(res.status))
      }

      router.push('/')
    } catch (error) {
      setMessage('Failed to add pet')
    }
  }
  const handleSubmit = (values: IFormState) => {
    console.log(values)
    forNewPet ? postData(values) : putData(values)
  }

  return (
    <div>
      <Formik
        validationSchema={PetFormSchema}
        initialValues={initFormikValues}
        validateOnChange
        onSubmit={handleSubmit}
      >
        {() => (
          <Form id={formId} className={styles.form}>
            <div className={styles.form_fields}>
              <div className={styles.flex_field}>
                <Field name="name" component={CustomInputField} label="* Pet Name" />
                <Field name="breed" component={CustomInputField} label="Breed" />
              </div>
              <div className={styles.flex_field}>
                <Field name="species" component={CustomInputField} label="* Species" />
                <Field type="number" name="age" component={CustomInputField} label="Age" />
              </div>
              <div className={styles.flex_field}>
                {/* --- CUSTOM CHECKBOX */}
                <label className={styles.checkbox}>
                  Poddy Trained
                  <Field type="checkbox" id="poddy_trained" name="poddy_trained" />
                  <span className={styles.checkmark}></span>
                </label>
                <Field>
                  {({ form, meta }) => (
                    <div className="input-fieldset">
                      <label className="label" htmlFor="country">Country</label>
                      <div className={styles.select_country}>
                        <img src={`https://www.countryflags.io/${form.values.country?.value}/flat/64.png`} />
                        <Select
                          options={options}
                          name="country"
                          id="country"
                          value={form.values.country}
                          onChange={(val) => {
                            form.setValues(((vals: IFormState) => ({ ...vals, country: val })))
                          }}
                        />
                      </div>
                    </div>
                  )
                  }
                </Field>
              </div>
              <CustomMultiSelect
                name="likes"
                options={petForm.likes}
                iid="likes"
                placeholder=""
                label="Likes"
              />
              <CustomMultiSelect
                name="dislikes"
                options={petForm.dislikes}
                iid="dislikes"
                placeholder=""
                label="Dislikes"
              />
              <CustomMultiSelect
                name="Diet"
                iid="diet"
                options={petForm.diet}
                placeholder=""
                defaultValues={petForm.diet}
                label="Diet"
              />
              <div>
                <button type="submit" className="btn">
                  Submit
              </button>
              </div>
            </div>
            <div className={styles.images}>
              <div className={styles.placeholder}>

              </div>
            </div>
            {/* 
            <label htmlFor="image_url">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              required
            />
            /> */}
          </Form>
        )}
      </Formik>
    </div>

  )
}

export default PetForm

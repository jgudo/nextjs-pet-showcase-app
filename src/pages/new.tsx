import fetcher from '@/lib/fetcher';
import Router from 'next/router';
import useSWR from 'swr';
import Form from '../components/Form';

const petForm = {
  name: '',
  species: '',
  age: 0,
  poddy_trained: false,
  diet: [],
  image_url: '',
  likes: [],
  dislikes: [],
}

const NewPet = () => {
  const { data: user, mutate } = useSWR('api/user', fetcher);

  if (!user) Router.push('/login');

  return (
    <Form
      formId="add-pet-form"
      petForm={petForm}
    />
  )
}

export default NewPet

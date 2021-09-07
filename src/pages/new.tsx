import { PetForm } from '@/components/shared';
import { useCurrentUser } from '@/hooks/useUser';
import Head from 'next/head';
import Router from 'next/router';

const petForm = {
  name: '',
  species: '',
  breed: '',
  age: 0,
  poddy_trained: false,
  diet: [],
  images: [],
  likes: [],
  dislikes: [],
}

const NewPet = () => {
  const { user } = useCurrentUser();

  if (!user && typeof window !== 'undefined') Router.push('/login');

  return (
    <div className="p-4 laptop:px-20 my-20">
      <Head>
        <title>Submit your Pet | PawShow</title>
      </Head>
      <PetForm
        formId="add-pet-form"
        petForm={petForm}
        title="Share your pet"
        forNewPet={true}
      />
    </div>
  )
}

export default NewPet

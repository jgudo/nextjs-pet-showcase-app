import { PetForm } from '@/components/shared'
import fetcher from '@/lib/fetcher'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const EditPet = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: pet, error } = useSWR(id ? `/api/pets/${id}` : null, fetcher)

  if (error) return <p>Failed to load</p>
  if (!pet) return <p>Loading...</p>

  return (
    <div className="edit-pet">
      <PetForm
        formId="edit-pet-form"
        petForm={pet.data}
        forNewPet={false}
        title="Edit Pet details"
      />

      <style jsx>
        {`
          .edit-pet {
            padding: 50px;
            margin-top: 80px;
          }
        `}
      </style>
    </div>
  )
}

export default EditPet

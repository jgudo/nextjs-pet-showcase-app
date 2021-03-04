import { deletePet } from '@/lib/api'
import fetcher from '@/lib/fetcher'
import { IPet } from '@/types/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { AiOutlineDelete, AiOutlineLoading } from 'react-icons/ai'
import { FiEdit3 } from 'react-icons/fi'
import useSWR from 'swr'

const PetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query
  const { data: petData, error } = useSWR<{ data: IPet }>(id ? `/api/pets/${id}` : null, fetcher);
  const pet = petData?.data;
  const [isDeleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [activeImage, setActiveImage] = useState(pet?.image || null);

  if (error) return <h1>Failed to load</h1>
  if (!petData) return <h1>Loading...</h1>

  const handleDelete = async () => {
    const petID = router.query.id

    try {
      setDeleting(true);

      await deletePet(petID as string);

      setDeleting(false);
      router.push('/')
    } catch (error) {
      setMessage(error);
      setDeleting(false);
    }
  }

  return (
    <div className="py-8 px-12 mt-20 flex items-start">
      {/* ------ IMAGES ------------ */}
      <div className="flex-basis-40 w-full h-120 bg-gray-300 rounded-lg shadow-lg overflow-hidden sticky top-20 flex flex-col">
        <div
          className="w-full h-full !bg-cover !bg-no-repeat !bg-center"
          style={{ background: `#f1f1f1 url(${activeImage?.url || pet.image?.url})` }}
        />
        {pet.images?.length > 0 && (
          <div className="grid grid-cols-4 bg-gray-400 h-24">
            {[pet.image, ...pet.images].map(image => (
              <div
                className={`w-full opacity-80 h-full hover:cursor-pointer !bg-cover !bg-no-repeat !bg-center ${activeImage?.public_id === image.public_id && 'opacity-100 border-2 border-solid border-accent-400'}`}
                key={image.public_id}
                onClick={() => setActiveImage(image)}
                style={{ background: `#f1f1f1 url(${image.url})` }}
              />
            ))}
          </div>
        )}
      </div>
      {/* ------------ DETAILS ---------- */}
      <div className="h-full flex-basis-60 p-12 rounded-lg shadow-lg bg-white ml-8 space-y-4">
        <div>
          <span className="text-xs text-gray-500">Name</span>
          <h1 className="pet-name">{pet.name}</h1>
        </div>
        <div>
          <span className="text-xs text-gray-500">From</span>
          {pet.country && (
            <div className="flex items-center">
              <img
                alt={pet.country.label}
                className="w-10"
                src={`https://www.countryflags.io/${pet.country?.value}/flat/64.png`}
              />
            &nbsp;
              <h4>{pet.country.label}</h4>
            </div>
          )}
        </div>
        <div>
          <span className="text-gray-500 text-xs">Owner</span>
          <h4>{pet.owner?.name}</h4>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Likes</span>
          <ul>
            {pet.likes.map((data, index) => (
              <li key={index}>{data} </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Dislikes</span>
          <ul>
            {pet.dislikes.map((data, index) => (
              <li key={index}>{data} </li>
            ))}
          </ul>
        </div>
        {pet.isOwnPet && (
          <div className="flex">
            <Link href="/pet/[id]/edit" as={`/pet/${pet._id}/edit`}>
              <button
                className="flex items-center"
                disabled={isDeleting}
              >
                <FiEdit3 />
                &nbsp;
                Edit
              </button>
            </Link>
            &nbsp;
            <button
              className="flex items-center bg-red-500 text-white hover:bg-red-600"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? <AiOutlineLoading className="spin" /> : <AiOutlineDelete />}
              &nbsp;
              Delete
            </button>
          </div>
        )}
      </div>
      {message && <p>{message}</p>}
    </div>
  )
}

export default PetPage;
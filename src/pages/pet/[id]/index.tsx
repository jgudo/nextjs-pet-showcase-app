import { Footer } from '@/components/common'
import { deletePet } from '@/lib/api'
import fetcher from '@/lib/fetcher'
import { IPet } from '@/types/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { AiOutlineDelete, AiOutlineLoading } from 'react-icons/ai'
import { FiEdit3 } from 'react-icons/fi'
import Skeleton from 'react-loading-skeleton'
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
    <div className="py-8 w-full laptop:w-3/4 mx-auto px-4 laptop:px-12 mt-12 laptop:mt-20">
      <div className="flex flex-col laptop:flex-row items-start">
        {/* ------ IMAGES ------------ */}
        <div className="laptop:flex-basis-40 w-full h-80 laptop:h-120 overflow-hidden laptop:sticky laptop:top-20 flex flex-col">
          {!pet ? (
            <Skeleton width={'100%'} height={320} />
          ) : (
            <>
              <div
                className="w-full h-full !bg-cover rounded-lg shadow-lg !bg-no-repeat !bg-center"
                style={{ background: `#f1f1f1 url(${activeImage?.url || pet.image?.url})` }}
              />
              <div className="mt-4">
                {pet.images?.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 h-20 laptop:h-24">
                    {[pet.image, ...pet.images].map(image => (
                      <div
                        className={`w-full opacity-80 h-full rounded-lg shadow-lg hover:cursor-pointer !bg-cover !bg-no-repeat !bg-center ${activeImage?.public_id === image.public_id && 'opacity-100 border-2 border-solid border-accent-400'}`}
                        key={image.public_id}
                        onClick={() => setActiveImage(image)}
                        style={{ background: `#f1f1f1 url(${image.url})` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* ------------ DETAILS ---------- */}
        <div className="h-full flex-basis-60 py-4 laptop:p-12  laptop:ml-8 space-y-4">
          <div>
            <h2>{!pet ? <Skeleton width={150} height={15} /> : 'Hello!'}</h2>
            <h1>
              {pet && 'I\'m '}
              {!pet ? <Skeleton width={200} height={25} /> : <span className="text-primary-500">{pet.name}</span>}
            </h1>
          </div>
          {!pet ? (
            <Skeleton height={10} count={4} />
          ) : (
            <div>
              <p className="text-gray-600">{pet.description}</p>
            </div>
          )}
          <div>
            <span className="text-xs text-gray-500">{!pet ? <Skeleton width={100} height={15} /> : 'Species'}</span>
            <h5 className="pet-name">{pet?.species || <Skeleton width={80} height={10} />}</h5>
          </div>
          {pet && (
            <>
              <div>
                <span className="text-xs text-gray-500">From</span>
                {pet.country && (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-10 h-10 rounded-full !bg-no-repeat !bg-center shadow-lg !bg-size-flag"
                      style={{ background: `#f1f1f1 url(${`https://www.countryflags.io/${pet.country?.value}/shiny/64.png`})` }}
                      title={pet.country?.label || ""}
                    />
                    &nbsp;
                    <h4>{pet.country.label}</h4>
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-500 text-xs">Owner</span>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-10 h-10 rounded-full !bg-cover !bg-no-repeat !bg-center shadow-lg"
                    style={{ background: `#f1f1f1 url(${pet.owner.photo?.url || 'https://i.pravatar.cc/150'})` }}
                    title={pet.country?.label || ""}
                  />
                  <Link href={`/owner/${pet.owner._id}`}>
                    <a className="font-bold">{pet.owner?.name}</a>
                  </Link>
                </div>
              </div>
              {(pet.likes && pet.likes?.length !== 0) && (
                <div>
                  <span className="text-gray-500 text-xs">Likes</span>
                  <ul>
                    {pet.likes.map((data, index) => (
                      <li key={index}>{data} </li>
                    ))}
                  </ul>
                </div>
              )}
              {(pet.dislikes && pet.dislikes?.length !== 0) && (
                <div>
                  <span className="text-gray-500 text-xs">Dislikes</span>
                  <ul>
                    {pet.dislikes.map((data, index) => (
                      <li key={index}>{data} </li>
                    ))}
                  </ul>
                </div>
              )}
              {(pet.diet && pet.diet?.length !== 0) && (
                <div>
                  <span className="text-gray-500 text-xs">Diet</span>
                  <ul>
                    {pet.diet.map((data, index) => (
                      <li key={index}>{data} </li>
                    ))}
                  </ul>
                </div>
              )}
              {pet.isOwnPet && (
                <div className="flex space-x-4 mt-8">
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
            </>
          )}
        </div>
      </div>
      {message && <p>{message}</p>}
      <Footer />
    </div>
  )
}

export default PetPage;
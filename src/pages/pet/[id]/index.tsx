import fetcher from '@/lib/fetcher'
import { IPet } from '@/types/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit3 } from 'react-icons/fi'
import useSWR from 'swr'

const PetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query
  const { data: petData, error } = useSWR<{ data: IPet }>(id ? `/api/pets/${id}` : null, fetcher);
  const pet = petData?.data;
  const [message, setMessage] = useState('');
  const [activeImage, setActiveImage] = useState(pet?.image || null);

  if (error) return <h1>Failed to load</h1>
  if (!petData) return <h1>Loading...</h1>

  const handleDelete = async () => {
    const petID = router.query.id

    try {
      await fetch(`/api/pets/${petID}`, {
        method: 'Delete',
        credentials: 'include'
      })
      router.push('/')
    } catch (error) {
      setMessage('Failed to delete the pet.')
    }
  }

  return (
    <div className="view">
      {/* ------ IMAGES ------------ */}
      <div className="images">
        <div
          className="image-background"
          style={{ background: `#f1f1f1 url(${activeImage?.url || pet.image?.url})` }}
        />
        {pet.images?.length > 0 && (
          <div className="image-list">
            {[pet.image, ...pet.images].map(image => (
              <div
                className={`image-item image-background ${activeImage?.public_id === image.public_id && 'image-active'}`}
                key={image.public_id}
                onClick={() => setActiveImage(image)}
                style={{ background: `#f1f1f1 url(${image.url})` }}
              />
            ))}
          </div>
        )}
      </div>
      {/* ------------ DETAILS ---------- */}
      <div className="details">
        <div className="details-wrapper">
          <span className="text-subtle text-xs">Name</span>
          <h1 className="pet-name">{pet.name}</h1>
        </div>
        <div className="details-wrapper">
          <span className="text-subtle text-xs">From</span>
          {pet.country && (
            <div className="country">
              <img
                alt={pet.country.label}
                className="country-badge"
                src={`https://www.countryflags.io/${pet.country?.value}/flat/64.png`}
              />
            &nbsp;
              <h4>{pet.country.label}</h4>
            </div>
          )}
        </div>
        <div className="details-wrapper">
          <span className="text-subtle text-xs">Owner</span>
          <h4>{pet.owner?.name}</h4>
        </div>
        <div className="details-wrapper">
          <span className="text-subtle text-xs">Likes</span>
          <ul>
            {pet.likes.map((data, index) => (
              <li key={index}>{data} </li>
            ))}
          </ul>
        </div>
        <div className="details-wrapper">
          <span className="text-subtle text-xs">Dislikes</span>
          <ul>
            {pet.dislikes.map((data, index) => (
              <li key={index}>{data} </li>
            ))}
          </ul>
        </div>
        {pet.isOwnPet && (
          <div className="btn-container">
            <Link href="/pet/[id]/edit" as={`/pet/${pet._id}/edit`}>
              <button className="btn button--icon">
                <FiEdit3 />
                &nbsp;
                Edit
              </button>
            </Link>
            &nbsp;
            <button className="btn button--danger button--icon" onClick={handleDelete}>
              <AiOutlineDelete />
              &nbsp;
              Delete
            </button>
          </div>
        )}
      </div>
      {message && <p>{message}</p>}
      <style jsx>
        {`
          .view {
            padding: 30px 50px;
            margin-top: 80px;
            display: flex;
            align-items: flex-start;
          }

          .images {
            flex-basis: 40%;
            width: 100%;
            height: 500px;
            background: #f5f5f5;
            border-radius: 20px;
            box-shadow: 0 10px 20px rgba(0,0,0, .05);
            overflow: hidden;
            position: sticky;
            top: 80px;
            display: flex;
            flex-direction: column;
          }

          .image-background {
            width: 100%;
            height: 100%;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
          }

          .image-list {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            background: #cacaca;
          }

          .image-item {
            width: 100px;
            height: 100px;
            opacity: .8;
          }

          .image-item:hover {
            cursor: pointer;
            opacity: 1;
            border: 1px solid var(--accent);
          }

          .image-active {
            opacity: 1;
            border: 1px solid var(--accent);
          }

          .details {
            height: 100%;
            flex-basis: 60%;
            padding: 50px;
            border-radius: 20px;
            box-shadow: 0 10px 20px rgba(0,0,0, .05);
            background: #fff;
            margin-left: 30px;
          }

          .details-wrapper {
            margin-bottom: 10px;
          }

          .country {
            display: flex;
            align-items: center;
          }

          .country-badge {
            width: 40px;
          }   

          .btn-container {
            display: flex;
          }
        `}
      </style>
    </div>
  )
}

export default PetPage;
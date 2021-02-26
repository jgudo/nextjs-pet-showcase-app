import fetcher from '@/lib/fetcher'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import useSWR from 'swr'

const PetPage: FC = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const { id } = router.query
  const { data: pet, error } = useSWR(id ? `/api/pets/${id}` : null, fetcher);

  if (error) return <h1>Failed to load</h1>
  if (!pet) return <h1>Loading...</h1>

  const handleDelete = async () => {
    const petID = router.query.id

    try {
      await fetch(`/api/pets/${petID}`, {
        method: 'Delete',
      })
      router.push('/')
    } catch (error) {
      setMessage('Failed to delete the pet.')
    }
  }

  return (
    <div className="view">
      <div className="images">
        <img src={pet.data.image?.url} />
      </div>
      <div className="details">
        <div className="details-wrapper">
          <span className="text-subtle text-xs">Name</span>
          <h1 className="pet-name">{pet.data.name}</h1>
        </div>
        <div className="details-wrapper">
          <span className="text-subtle text-xs">From</span>
          {pet.data.country && (
            <div className="country">
              <img
                alt={pet.data.country.label}
                className="country-badge"
                src={`https://www.countryflags.io/${pet.data.country?.value}/flat/64.png`}
              />
            &nbsp;
              <h4>{pet.data.country.label}</h4>
            </div>
          )}
        </div>
        <div className="details-wrapper">
          <span className="text-subtle text-xs">Owner</span>
          <h4>{pet.data.owner?.name}</h4>
        </div>
        <div className="details-wrapper">
          <span className="text-subtle text-xs">Likes</span>
          <ul>
            {pet.data.likes.map((data, index) => (
              <li key={index}>{data} </li>
            ))}
          </ul>
        </div>
        <div className="details-wrapper">
          <span className="text-subtle text-xs">Dislikes</span>
          <ul>
            {pet.data.dislikes.map((data, index) => (
              <li key={index}>{data} </li>
            ))}
          </ul>
        </div>
        {pet.data.isOwnPet && (
          <div className="btn-container">
            <Link href="/pet/[id]/edit" as={`/pet/${pet.data._id}/edit`}>
              <button className="btn edit">Edit</button>
            </Link>
            <button className="btn delete" onClick={handleDelete}>
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
          }

          .images img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .details {
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
        `}
      </style>
    </div>
  )
}

export default PetPage;
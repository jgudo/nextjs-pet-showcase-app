import { PetGrid, Sidebar } from '@/components/shared';
import fetcher from '@/lib/fetcher';
import { FC } from 'react';
import useSWR from 'swr';

const Index: FC = () => {
  const { data: pets, error } = useSWR('/api/pets', fetcher);

  if (error) return <h1>Failed to load</h1>
  if (!pets) return <h1>Loading...</h1>

  return pets.length !== 0 && (
    <div className="content">
      <Sidebar />
      <PetGrid pets={pets} />
      <style jsx>
        {`
        .content {
          display: flex;
        }
      `}
      </style>
    </div>
  )
}

export default Index

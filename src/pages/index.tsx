import { Sidebar } from '@/components/common';
import { PetGrid } from '@/components/shared';
import { FC } from 'react';

const Index: FC = () => {
  return (
    <div className="content">
      <Sidebar />
      <PetGrid />
      <style jsx>
        {`
        .content {
          display: flex;
          margin: 80px 0;
          padding: 20px 50px;
        }
      `}
      </style>
    </div>
  )
}

export default Index

import { createFileRoute } from '@tanstack/react-router';
import { Hero } from 'design/Hero';
import type { FC } from 'react';

const Index: FC = () => {
  return (
    <Hero
      title={'Crisil <> SBI'}
      description={'This is a new start of CLMM with Crisil <> SBI'}
    />
  );
};

export const Route = createFileRoute('/')({
  component: Index,
});

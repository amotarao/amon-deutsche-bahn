import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

type Props = {
  name: string;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = (context) => {
  const name = (context.params?.name as string) ?? '';

  return {
    props: {
      name,
    },
  };
};

const Page: NextPage<Props> = ({ name }) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  );
};

export default Page;

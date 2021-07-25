import { GetStaticPaths, GetStaticProps } from 'next';
import { ReactElement } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

/*
  Utilizar o método query para buscar todos os posts e o getByUID para buscar as informações do post específico.
*/

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(): ReactElement {
  return (
    <>
      <Header />

      <img
        className={styles.banner}
        src="https://images8.alphacoders.com/115/1156488.png"
        alt=""
      />

      <article className={styles.post}>
        <h1>Criando um app CRA do zero</h1>

        <div className={styles.postInfos}>
          <div>
            <FiCalendar /> 15 Mar 2021
          </div>

          <div>
            <FiUser /> Joseph Oliveira
          </div>

          <div>
            <FiClock /> 4 min
          </div>
        </div>

        <main className={styles.postContent}>
          <div>
            <h2>Proin et varius</h2>

            <p className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dolor sapien, vulputate eu diam at, condimentum hendrerit tellus.
              Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.
              Ut venenatis mauris vel libero pretium, et pretium ligula
              faucibus. Morbi nibh felis, elementum a posuere et, vulputate et
              erat. Nam venenatis.
            </p>
          </div>

          <div>
            <h2>Cras laoreet mi</h2>

            <p className="content">
              Nulla auctor sit amet quam vitae commodo. Sed risus justo,
              vulputate quis neque eget, dictum sodales sem. In eget felis
              finibus, mattis magna a, efficitur ex. Curabitur vitae justo
              consequat sapien gravida auctor a non risus. Sed malesuada mauris
              nec orci congue, interdum efficitur urna dignissim. Vivamus cursus
              elit sem, vel facilisis nulla pretium consectetur. Nunc congue.
            </p>
          </div>
        </main>
      </article>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };

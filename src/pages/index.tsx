import { GetStaticProps } from 'next';
import Link from 'next/link';
import { ReactElement } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

/*
  Utilizar o método query para retornar todos os posts já com paginação. Por padrão, a paginação vem configurada como 20. Portanto se quiser testar sem ter que criar mais de 20 posts, altere a opção pageSize para o valor que deseja.
*/

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): ReactElement {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src="/logo.svg" alt="logo" />
      </header>

      <div>
        <Link href="/post/1">
          <a className={styles.post}>
            <h1>Como utilizar Hooks</h1>

            <p>Pensando em sincronização em vez de ciclos de vida.</p>

            <div>
              <div>
                <FiCalendar /> 15 Mar de 2021
              </div>

              <div>
                <FiUser /> Joseph Oliveira
              </div>
            </div>
          </a>
        </Link>

        <Link href="/post/1">
          <a className={styles.post}>
            <h1>Como utilizar Hooks</h1>

            <p>Pensando em sincronização em vez de ciclos de vida.</p>

            <div>
              <div>
                <FiCalendar /> 15 Mar de 2021
              </div>

              <div>
                <FiUser /> Joseph Oliveira
              </div>
            </div>
          </a>
        </Link>
      </div>

      <button className={styles.morePosts} type="button">
        Carregar mais posts
      </button>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };

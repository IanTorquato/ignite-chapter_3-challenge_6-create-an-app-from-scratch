import { GetStaticPaths, GetStaticProps } from 'next';
import { ReactElement } from 'react';
import Prismic from '@prismicio/client';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
// import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

export default function Post({ post }: PostProps): ReactElement {
  const router = useRouter();

  function readingTime(): number {
    const qtd = post.data.content.reduce((acc, contentValue) => {
      const qtdHeading = contentValue.heading.split(/\s/g).length;

      const qtdBody = contentValue.body.reduce((accBody, valueBody) => {
        const bodyWords = valueBody.text.split(/\s/g).length;
        return accBody + bodyWords;
      }, 0);

      return qtdHeading + qtdBody;
    }, 0);
    return Math.ceil(qtd / 200) + 1;
  }

  return (
    <>
      <Header />

      {router.isFallback && <div>Carregando...</div>}

      {post && (
        <>
          <img
            className={styles.banner}
            src={post.data.banner.url}
            alt={post.data.title}
          />

          <article className={styles.post}>
            <h1>{post.data.title}</h1>

            <div className={styles.postInfos}>
              <div>
                <FiCalendar />{' '}
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </div>

              <div>
                <FiUser /> {post.data.author}
              </div>

              <div>
                <FiClock /> {readingTime()} min
              </div>
            </div>

            <main className={styles.postContent}>
              {post.data.content.map(({ heading, body }) => (
                <div key={heading}>
                  <h2>{heading}</h2>

                  {body.map(({ text }) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              ))}
            </main>
          </article>
        </>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      fetch: [''],
      pageSize: 3,
    }
  );

  return {
    paths: posts.results.map(post => ({
      params: {
        slug: post.uid,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID(
    'posts',
    String(context.params.slug),
    {}
  );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: { post },
  };
};

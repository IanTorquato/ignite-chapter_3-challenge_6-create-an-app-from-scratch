import { GetStaticProps } from 'next';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';

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

function serializePostsDate(posts: Post[]): Post[] {
  return posts.map(post => ({
    ...post,
    first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR }),
  }));
}

export default function Home({ postsPagination }: HomeProps): ReactElement {
  const [next_page, setNext_page] = useState(postsPagination.next_page);
  const [results, setResults] = useState<Post[]>(serializePostsDate(postsPagination.results));

  function handleListMorePosts(): void {
    fetch(next_page)
      .then(res => res.json())
      .then(res => {
        setNext_page(res.next_page);
        setResults(serializePostsDate([...results, ...res.results]));
      });
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src="/logo.svg" alt="logo" />
      </header>

      <div>
        {results.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a className={styles.post}>
              <h1>{post.data.title}</h1>

              <p>{post.data.subtitle}</p>

              <div>
                <div>
                  <FiCalendar /> {post.first_publication_date}
                </div>

                <div>
                  <FiUser /> {post.data.author}
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>

      {next_page && (
        <button className={styles.morePosts} type="button" onClick={handleListMorePosts}>
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(Prismic.predicates.at('document.type', 'posts'), {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 3,
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(post => ({
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    })),
  };

  return {
    props: { postsPagination },
  };
};

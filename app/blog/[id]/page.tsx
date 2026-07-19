import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog";
import { BlogPostView } from "@/components/blog/BlogPostView";

type BlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = blogPosts.find((item) => item.id === id);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Himanshu Aashish`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = blogPosts.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  return <BlogPostView post={post} />;
}

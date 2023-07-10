import Layout from "~/components/layout";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
      router.replace('/schema/1');
  }, [router]);

  return (
    <Layout>
      <div />
    </Layout>
  );
}

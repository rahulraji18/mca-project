import React from "react";
import Head from "next/head";

const Seo = ({ title }) => {
  let i = `FMS - ${title}`;
  return (
    <Head>
      <title>{i}</title>
      <link rel="icon" href={""} />
    </Head>
  );
};

export default Seo;

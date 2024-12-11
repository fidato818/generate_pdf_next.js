"use client";
import Head from "next/head";
import React from "react";
import styles from "./styles/Home.module.css";
import { useSetState } from "ahooks";
import { BASE_API_URL } from "./utils/constants";
const Home = () => {
  const [state, setState] = useSetState({
    name: "Customer",
    email: "Customer@gmail.com",
    total: "4,50,000",
    arr: [
      {
        itemName: "Panadol",
        itemQuantity: 1,
        productPrice: 31.35,
        totalItmPrc: 31.35,
      },
      {
        itemName: "Panadol Extra",
        itemQuantity: 2,
        productPrice: 61.35,
        totalItmPrc: 131.35,
      },
    ],
  });

  const generateInvoice = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const fetchData = async () => {
      const { name, email, total, arr } = state;
      // const data = await fetch("http://localhost:3000/api/generate-invoice", {
      const data = await fetch(`${BASE_API_URL}/api/generate-invoice`, {
        // const data = await fetch("https://generate-pdf-next-js.vercel.app/api/generate-invoice", {
        method: "POST",
        body: JSON.stringify({ name, email, total, arr }),
      });

      if(!data.ok){
        throw new Error('error while getting  tasks')
      }

      return data.arrayBuffer();
    };
    const saveAsPDF = async () => {
      const buffer = await fetchData();
      const blob = new Blob([buffer]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      // link.download = "invoice.pdf";
      link.download = `${new Date().valueOf()}.pdf`;
      link.click();
    };

    saveAsPDF();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Generate Customer Invoice</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Hello {state.name} 👋</h1>

        <p className={styles.description}>
          Fill the form below to generate your invoice
        </p>

        <form className={styles.form} onSubmit={generateInvoice}>
          <div className={styles.field}>
            <label htmlFor="name">Enter Name</label>
            <input
              id="name"
              type="text"
              value={state.name}
              onChange={(e) =>
                setState({
                  name: e.target.value,
                })
              }
            />
          </div>

          <button className={styles.button} type="submit">
            Download Invoice
          </button>
        </form>
      </main>
    </div>
  );
};

export default Home;

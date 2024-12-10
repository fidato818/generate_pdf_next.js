"use client";
import Head from "next/head";
import React, { useLayoutEffect, useState } from "react";
import styles from "./styles/Home.module.css";
import axios from "axios";
const Home = () => {
  const [name, setName] = useState("Customer");

  const [email, setEmail] = useState("Customer@gmail.com");
  const [total, setTotal] = useState("4,50,000");
  const [arr, setArr] = useState([
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
  ]);
  console.log(arr);
  const generateInvoice = (e: any) => {
    e.preventDefault();

    const fetchData = async () => {
      const data = await fetch("http://localhost:3000/api/generate-invoice", {
        method: "POST",
        body: JSON.stringify({ name, email, total, arr }),
      });

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
        <h1 className={styles.title}>Hello {name} 👋</h1>

        <p className={styles.description}>
          Fill the form below to generate your invoice
        </p>

        <form className={styles.form} onSubmit={generateInvoice}>
          <div className={styles.field}>
            <label htmlFor="name">Enter Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

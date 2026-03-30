import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllProducts } from "../api";
import ProductCard from "../components/cards/ProductsCard";
import { CircularProgress } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const SearchWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 12px;
  background: ${({ theme }) => theme.card};
  margin-top: 20px;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
`;

const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const getProducts = async (query) => {
    setLoading(true);
    try {
      const res = await getAllProducts(`search=${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (search.length > 2) {
      getProducts(search);
    } else if (search.length === 0) {
        getProducts("");
    }
  }, [search]);

  useEffect(() => {
    getProducts("");
  }, []);

  return (
    <Container>
      <SearchWrapper>
        <SearchRounded sx={{ color: "inherit" }} />
        <Input
          placeholder="Search for food, ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchWrapper>
      <Section>
        <Title>Search Results</Title>
        {loading ? (
          <CircularProgress />
        ) : (
          <CardWrapper>
            {products.length === 0 ? (
              <div>No dishes found according to your search.</div>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </CardWrapper>
        )}
      </Section>
    </Container>
  );
};

export default Search;

import { createContext, useContext } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: visible;
`;

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;

  @media (max-width: 768px) {
    grid-template-columns: ${(props) => props.columnsTablet || props.columns};
    column-gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: ${(props) =>
      props.columnsMobile || props.columnsTablet || props.columns};
    column-gap: 0.5rem;
  }
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1;
    padding: 1rem 1.2rem;

    /* Hide only the avans column on tablet and smaller */
    & .avans-column {
      display: none;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1;
    padding: 0.8rem 1rem;
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    line-height: 1.2;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1;
  }
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1rem 1.2rem;

    /* Hide only the avans column on tablet and smaller */
    & .avans-column {
      display: none;
    }

    /* Keep the actions column (menu toggle) visible */
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.8rem 1rem;
  }
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

const TableContext = createContext();

function Table({ columns, columnsTablet, columnsMobile, children }) {
  return (
    <TableContext.Provider value={{ columns, columnsTablet, columnsMobile }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { columns, columnsTablet, columnsMobile } = useContext(TableContext);
  return (
    <StyledHeader
      role="row"
      columns={columns}
      columnsTablet={columnsTablet}
      columnsMobile={columnsMobile}
      as="header"
    >
      {children}
    </StyledHeader>
  );
}

function Row({ children, style }) {
  const { columns, columnsTablet, columnsMobile } = useContext(TableContext);
  return (
    <StyledRow
      role="row"
      columns={columns}
      columnsTablet={columnsTablet}
      columnsMobile={columnsMobile}
      style={style}
    >
      {children}
    </StyledRow>
  );
}

function Body({ data, render }) {
  if (!data?.length) return <Empty>Nema rezervacija.</Empty>;

  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;

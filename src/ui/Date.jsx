import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import Button from "./Button";
import "../styles/datepicker.css";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.p`
  line-height: 1;
  font-weight: 500;
`;

export const StyledDatePickerInput = styled.input`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  font-size: 1.4rem;
  width: 100%;
  max-width: 100%;

  &::placeholder {
    font-size: 1.4rem;
    color: var(--color-grey-500);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
    max-width: 20rem;
  }
`;

function DateComponent({
  children,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Wrapper>
      <Label>{children}</Label>

      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Početni datum"
        dateFormat="dd.MM"
        customInput={<StyledDatePickerInput />}
      />

      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="Krajnji datum"
        dateFormat="dd.MM"
        customInput={<StyledDatePickerInput />}
      />

      <Button variation="secondary" size="small" onClick={resetDates}>
        Resetuj datume
      </Button>
    </Wrapper>
  );
}

export default DateComponent;

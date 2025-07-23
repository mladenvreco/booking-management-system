import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: ${(props) => props.size || "15rem"}; /* Default size is 6rem */
  width: auto;
`;

function Logo({ size }) {
  return (
    <StyledLogo>
      <Img src="logo-transparent2.png" alt="Logo" size={size} />
    </StyledLogo>
  );
}

export default Logo;

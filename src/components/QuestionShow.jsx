import React from 'react';
import styled from 'styled-components';

const QuestionShowContainer = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  border-bottom: 2px solid #d8d8d852;
  padding: 6px 8px;

  flex-direction: column;
  margin-left: 10px;
`;

const Question = styled.h3`
  font-size: 15px;
  color: #000;

  display: flex;
`;

const Answer = styled.span`
  color: #a1a1a1;
  font-size: 16px;
  display: flex;
`;

export function QuestionShow(props) {
  const { question, answer } = props;

  return (
    <QuestionShowContainer>
      <Question>{question}</Question>
      <Answer>R: {answer}</Answer>
    </QuestionShowContainer>
  );
}

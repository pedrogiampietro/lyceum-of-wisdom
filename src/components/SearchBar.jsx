import React, { useEffect, useRef } from 'react';

import { IoClose, IoSearch } from 'react-icons/io5';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickOutside } from 'react-click-outside-hook';

import { useDebounce } from '../hooks/debounceHook';
import { QuestionShow } from './questionShow';

import MoonLoader from 'react-spinners/MoonLoader';
import styled from 'styled-components';

import enUS from '../translations/en/common.json';
import ptBR from '../translations/pt/common.json';

const SearchBarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 34em;
  height: 3.8em;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
`;

const SearchInputContainer = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 21px;
  color: #12112e;
  font-weight: 500;
  border-radius: 6px;
  background-color: transparent;

  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }

  &::placeholder {
    color: #bebebe;
    transition: all 250ms ease-in-out;
  }
`;

const SearchIcon = styled.span`
  color: #bebebe;
  font-size: 27px;
  margin-right: 10px;
  margin-top: 6px;
  vertical-align: middle;
`;

const CloseIcon = styled(motion.span)`
  color: #bebebe;
  font-size: 23px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #dfdfdf;
  }
`;

const LineSeperator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 2px;
  background-color: #d8d8d878;
`;

const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  overflow-y: auto;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarningMessage = styled.span`
  color: #a1a1a1;
  font-size: 14px;
  display: flex;
  align-self: center;
  justify-self: center;
`;

const containerVariants = {
  expanded: {
    height: '30em',
  },
  collapsed: {
    height: '3.8em',
  },
};

const containerTransition = { type: 'spring', damping: 22, stiffness: 150 };

export function SearchBar() {
  const inputRef = useRef();

  const [isExpanded, setExpanded] = useState(false);
  const [parentRef, isClickedOutside] = useClickOutside();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [questionShows, setQuestionShows] = useState([]);
  const [noQuestionShows, setNoQuestionShows] = useState(false);

  const isEmpty = !questionShows || questionShows.length === 0;

  const LocalStorage = localStorage.getItem('i18nextLng');

  const changeHandler = e => {
    e.preventDefault();
    if (e.target.value.trim() === '') setNoQuestionShows(false);

    setSearchQuery(e.target.value);
  };

  const expandContainer = () => {
    setExpanded(true);
  };

  const collapseContainer = () => {
    setExpanded(false);
    setSearchQuery('');
    setLoading(false);
    setNoQuestionShows(false);
    setQuestionShows([]);
    if (inputRef.current) inputRef.current.value = '';
  };

  useEffect(() => {
    if (isClickedOutside) collapseContainer();
  }, [isClickedOutside]);

  const prepareSearchQuery = query => {
    const reg = new RegExp(query);

    if (query == '') {
      return [];
    }

    if (LocalStorage === 'en') {
      return enUS.filter(function (term) {
        if (term.question.match(reg)) {
          return term;
        }
      });
    } else {
      return ptBR.filter(function (term) {
        if (term.question.match(reg)) {
          return term;
        }
      });
    }
  };

  const searchQuestionShow = async () => {
    if (!searchQuery || searchQuery.trim() === '') return;

    setLoading(true);
    setNoQuestionShows(false);

    const URL = prepareSearchQuery(searchQuery);

    if (URL) {
      if (URL && URL.length === 0) setNoQuestionShows(true);

      setQuestionShows(URL);
    }

    setLoading(false);
  };

  useDebounce(searchQuery, 500, searchQuestionShow);

  return (
    <SearchBarContainer
      animate={isExpanded ? 'expanded' : 'collapsed'}
      variants={containerVariants}
      transition={containerTransition}
      ref={parentRef}
    >
      <SearchInputContainer>
        <SearchIcon>
          <IoSearch />
        </SearchIcon>
        <SearchInput
          placeholder="Type The Question Here"
          onFocus={expandContainer}
          ref={inputRef}
          value={searchQuery}
          onChange={changeHandler}
        />
        <AnimatePresence>
          {isExpanded && (
            <CloseIcon
              key="close-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={collapseContainer}
              transition={{ duration: 0.2 }}
            >
              <IoClose />
            </CloseIcon>
          )}
        </AnimatePresence>
      </SearchInputContainer>
      {isExpanded && <LineSeperator />}
      {isExpanded && (
        <SearchContent>
          {isLoading && (
            <LoadingWrapper>
              <MoonLoader loading color="#000" size={20} />
            </LoadingWrapper>
          )}
          {!isLoading && isEmpty && !noQuestionShows && (
            <LoadingWrapper>
              <WarningMessage>Start typing to Search</WarningMessage>
            </LoadingWrapper>
          )}
          {!isLoading && noQuestionShows && (
            <LoadingWrapper>
              <WarningMessage>No questions found in database!</WarningMessage>
            </LoadingWrapper>
          )}
          {!isLoading && !isEmpty && (
            <>
              {questionShows.map(question => (
                <QuestionShow
                  key={question.id}
                  question={question.question}
                  answer={question.answer}
                />
              ))}
            </>
          )}
        </SearchContent>
      )}
    </SearchBarContainer>
  );
}

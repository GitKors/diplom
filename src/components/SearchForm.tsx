import React, { useState, useContext, FC, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { SearchParamsType, SearchResultType } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router-dom';
import Loader from '../components/Loader'
import {fetchSearchResults} from '../api/api'
import { fetchStatistics } from '../api/api';
import { fetchDocumentsByIds } from '../api/api';


import '../styles/SearchForm.css'

interface SearchFormProps {

}

interface FormState {
    inn: string;
    fullnessFlag: boolean;
    businessContext: boolean;
    mainRole: boolean;
    tone: string;
    riskFactors: boolean;
    technicalNews: boolean;
    announcements: boolean;
    newsDigests: boolean;
    documentCount: number;
    startDate: Date | null;
    endDate: Date | null;
    innError: string;
    dateError: string;
  }

  const SearchForm: FC<SearchFormProps> = (props) => {
    const { isAuthorized = false } = useContext(AuthContext) || {};
    const navigationFunction: NavigateFunction = useNavigate();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [searchResults, setSearchResults] = useState<any[]>([]); 
    const [statisticsData, setStatisticsData] = useState<any[]>([]); 

    




  
    const [state, setState] = useState<FormState>({
      inn: '',
      fullnessFlag: false,
      businessContext: false,
      mainRole: false,
      tone: 'любая',
      riskFactors: false,
      technicalNews: false,
      announcements: false,
      newsDigests: false,
      documentCount: 1,
      startDate: null,
      endDate: null,
      innError: '',
      dateError: '',
    });
  
    useEffect(() => {
      validateDates();
    }, [state.startDate, state.endDate]);
  
    function validateInn(inn: string | number): boolean {
      let error = { code: 0, message: '' };
      let result = false;
      let innString: string;
  
      if (typeof inn === 'number') {
          innString = inn.toString();
      } else if (typeof inn === 'string') {
          innString = inn;
      } else {
          innString = '';
      }
  
      if (!innString.length) {
          error.code = 1;
          error.message = 'ИНН пуст';
      } else if (/[^0-9]/.test(innString)) {
          error.code = 2;
          error.message = 'ИНН может состоять только из цифр';
      } else if ([10, 12].indexOf(innString.length) === -1) {
          error.code = 3;
          error.message = 'ИНН может состоять только из 10 или 12 цифр';
      } else {
          var checkDigit = function (inn: string, coefficients: number[]) {
              var n = 0;
              for (var i in coefficients) {
                  n += coefficients[i] * parseInt(inn[i]);
              }
              return parseInt(String(n % 11 % 10));
          };
  
          switch (innString.length) {
              case 10:
                  var n10 = checkDigit(innString, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
                  if (n10 === parseInt(innString[9])) {
                      result = true;
                  }
                  break;
              case 12:
                  var n11 = checkDigit(innString, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                  var n12 = checkDigit(innString, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                  if ((n11 === parseInt(innString[10])) && (n12 === parseInt(innString[11]))) {
                      result = true;
                  }
                  break;
          }
  
          if (!result) {
              error.code = 4;
              error.message = 'Неправильное контрольное число';
          }
      }
  
      setState(prevState => ({ ...prevState, innError: error.message }));
      return result;
    }


  

const validateDates = (): string => {
  const { startDate, endDate } = state;
  let error = '';

  console.log("startDate:", startDate);
  console.log("endDate:", endDate);

  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;
  const currentDate = new Date();

  console.log("Current date:", currentDate);

  if (parsedStartDate && parsedEndDate) {
    if (parsedStartDate > parsedEndDate) {
      error = 'Дата начала не может быть позже даты окончания';
      setState(prevState => ({ ...prevState, dateError: error }));
      console.error(error);
      return error;
    }
  }
  
  if (parsedStartDate && parsedStartDate > currentDate) {
    error = 'Дата начала не может быть в будущем';
    setState(prevState => ({ ...prevState, dateError: error }));
    console.error(error);
    return error;
  }
  
  if (parsedEndDate && parsedEndDate > currentDate) {
    error = 'Дата окончания не может быть в будущем';
    setState(prevState => ({ ...prevState, dateError: error }));
    console.error(error);
    return error;
  }
  
  setState(prevState => ({ ...prevState, dateError: error }));
  return error;
};





  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    if (type === 'checkbox') {
      setState(prevState => ({ ...prevState, [name]: checked }));
    } else if (name === 'startDate' || name === 'endDate') {
      setState(prevState => ({ ...prevState, [name]: value ? new Date(value) : null }));
      validateDates();
    } else {
      setState(prevState => ({ ...prevState, [name]: value }));
    }

    if (name === 'inn') {
      validateInn(value);
    }
};





const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setIsLoading(true);

  try {
    console.log('Выполняется запрос на /histograms');

    const token = localStorage.getItem('accessToken') || '';


    const statistics = await fetchStatistics(
      token,
      state.inn,
      state.startDate?.toISOString() || '',
      state.endDate?.toISOString() || ''
    );


    const results = await fetchSearchResults(
      token,
      state.inn,
      state.startDate?.toISOString() || '',
      state.endDate?.toISOString() || ''
    );


    setSearchResults(results);
    setStatisticsData(statistics);

    console.log(results);
    console.log(statistics);

    if (results && results.items) {
      const encodedIds = (results.items || []).map((item: { encodedId: string }) => item.encodedId);


      console.log(encodedIds);


      const documents = await fetchDocumentsByIds(token, encodedIds);

      localStorage.setItem('documentsData', JSON.stringify(documents));

      navigate('/resultpage');
    } else {
      console.error('Results or items are undefined or empty');
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  } finally {
    setIsLoading(false);
  }
};






  if (!isAuthorized) {
    navigate('/'); 
    return null;
  }

  return (
<>
{isLoading ? ( 
      <Loader />
    ) : (
    <div className='wrapper'>
  <div className='main-area'>
    <div className='container_form'>
        <h1 className='title-form'>
            Найдите необходимые<br/>
            данные в пару кликов.
        </h1>
        <h2 className='title-desc'>
        Задайте параметры поиска.<br/> 
        Чем больше заполните, тем точнее поиск
        </h2>

        <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-left-column">
            <div className="form-group">
            <label className="required-field">ИНН компании</label>
            <input
                placeholder='10 цифр'
                type="text"
                name="inn"
                value={state.inn}
                onChange={handleChange}
            />
            {state.innError && <div className="error-text">{state.innError}</div>}
            </div>
            <div className="form-group">
            <label>Тональность</label>
            <select
                name="tone"
                value={state.tone}
                onChange={handleChange}
            >
                <option value="любая">Любая</option>
                <option value="позитивная">Позитивная</option>
                <option value="негативная">Негативная</option>
            </select>
            </div>
            <div className="form-group">
            <label className="required-field">Количество документов в выдаче</label>
            <input
                type="number"
                name="documentCount"
                value={state.documentCount}
                min="1"
                max="1000"
                onChange={handleChange}
            />
            </div>
            <div className="form-group">
            <label>Диапазон поиска</label>
            <div className="date-range">
            <input
              type="date"
              name="startDate"
              value={state.startDate ? state.startDate.toISOString().substr(0, 10) : ''}
              onChange={handleChange}
            />
            <input
              type="date"
              name="endDate"
              value={state.endDate ? state.endDate.toISOString().substr(0, 10) : ''}
              onChange={handleChange}
            />

            </div>
            {state.dateError && (
                    <div className='err-date' style={{ color: 'red' }}>
                      {state.dateError}
                    </div>
                  )}
            </div>
        </div>
        <div className="form-right-column">
            <div className="form-group checkbox-group">
            <input
                type="checkbox"
                name="fullnessFlag"
                checked={state.fullnessFlag}
                onChange={handleChange}
            />
            <label>Признак максимальной полноты</label>
            </div>
            <div className="form-group checkbox-group">
            <input
                type="checkbox"
                name="businessContext"
                checked={state.businessContext}
                onChange={handleChange}
            />
            <label>Упоминания в бизнес-контексте</label>
            </div>
            <div className="form-group checkbox-group">
            <input
                type="checkbox"
                name="mainRole"
                checked={state.mainRole}
                onChange={handleChange}
            />
            <label>Главная роль в публикации</label>
            </div>
            <div className="form-group checkbox-group">
            <input
                type="checkbox"
                name="riskFactors"
                checked={state.riskFactors}
                onChange={handleChange}
            />
            <label>Публикации только с риск-факторами</label>
            </div>
            <div className="form-group checkbox-group">
            <input
                type="checkbox"
                name="technicalNews"
                checked={state.technicalNews}
                onChange={handleChange}
            />
            <label>Включать технические новости рынков</label>
            </div>
            <div className="form-group checkbox-group">
            <input
                type="checkbox"
                name="announcements"
                checked={state.announcements}
                onChange={handleChange}
            />
            <label>Включать анонсы и календари</label>
            </div>
            <div className="form-group checkbox-group">
            <input
                type="checkbox"
                name="newsDigests"
                checked={state.newsDigests}
                onChange={handleChange}
            />
            <label>Включать сводки новостей</label>
            </div>
            <div className="form-footer">
            <button
            type="submit"
            disabled={!!(state.innError || state.dateError || !state.inn || state.tone === '' || state.documentCount < 1 || state.documentCount > 1000 || !state.startDate || !state.endDate)}
            >
            Поиск
            </button>
            <div className="note">
            * Обязательные к заполнению поля
            </div>
        </div>
        </div>

        </form>
    </div>

    <div className='container-pic'>
      <img className='container-pic__illustration-file' src={process.env.PUBLIC_URL + '/file.svg'} alt="file_pic" />
      <img className='container-pic__illustration-folder' src={process.env.PUBLIC_URL + '/Folders.svg'} alt="folder_pic" />
      <img className='container-pic__illustration-searchpeople' src={process.env.PUBLIC_URL + '/searchpeople.svg'} alt="searchpeople_pic" />
    </div>
  </div>
  </div>
  )}
</>
);
};

export default SearchForm;
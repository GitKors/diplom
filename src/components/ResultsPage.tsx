import React, { useState, useEffect } from 'react';
import '../styles/ResultsPage.css';
import CarouselComponent from '../components/CarouselComponent';
import { fetchStatistics, fetchDocumentsByIds } from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

const ResultsPage: React.FC = () => {
  const [cardsContentArray, setCardsContentArray] = useState([]);
  const [token, setToken] = useState<string>('');
  const [inn, setInn] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [cardsData, setCardsData] = useState([]); 
  const [documentsData, setDocumentsData] = useState(null);
  const [parsedData, setParsedData] = useState<any[]>([]); 
 
  type Publication = {
    title: string;
    isTechNews: boolean;
    isAnnouncement: boolean;
    isDigest: boolean;
    wordCount: number;
    source: {
    name: string; 
    };

  };

  const [loadedPublications, setLoadedPublications] = useState<Publication[]>([]); 
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const [publicationsPerPage, setPublicationsPerPage] = useState(2);
  const [foundCount, setFoundCount] = useState<number | null>(null); 
  const [isLoadingCarousel, setIsLoadingCarousel] = useState(true);

  function formatDateString(dateString: string) {
    return dateString.slice(0, 10);
  }

  const loadMorePublications = () => {
    const newPublicationsPerPage = publicationsPerPage + 2; 
    setPublicationsPerPage(newPublicationsPerPage);
  
    if (newPublicationsPerPage >= cardsContentArray.length) {
      setLoadMoreVisible(false); 
    }
  };
  
    useEffect(() => {
    // Получаем токен из localStorage
    setIsLoadingCarousel(true);
    console.log('isLoadingCarousel set to true'); // Добавьте эту строку
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken !== null) { // Проверяем, что savedToken не является null
      setToken(savedToken);
      // Вызываем функцию fetchStatistics для получения данных
      fetchStatistics(savedToken, inn, startDate, endDate)
        .then((data: any) => {
          // Обработка данных из ответа
          const extractedData = data.data[0].data.map((item: any) => ({
            title: formatDateString(item.date),
            content: item.value.toString(),
            footer: '0',
          }));
          setCardsContentArray(extractedData);
          console.log('Результаты статистики:', extractedData);
          setFoundCount(extractedData.length);
          setIsLoadingCarousel(false); // Устанавливаем false после загрузки данных для карусели
          console.log('isLoadingCarousel set to false'); // Добавьте эту строку
        })
        .catch((error) => {
          console.error('Ошибка при выполнении запроса к API:', error);
        });

           // Получение данных из localStorage
    const storedData = localStorage.getItem('documentsData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setDocumentsData(parsedData);
      setParsedData(parsedData); 
      console.log('документы:', parsedData);}
    }

  }, [inn, startDate, endDate]);
  


// ФУНЦИЯ ДЛЯ XML
  function removeHTMLTags(input:any) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  }
  
  function extractTextFromXML(xml:any) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    return xmlDoc.documentElement.textContent;
  }
    

    function formatDate(dateString: string) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${day}.${month}.${year}`;
    } 

  return (
    <div className="results-page">
        <div className='title-container'>            
            <div>
                <h1 className='title-result'>Ищем. Скоро<br/> будут результаты</h1>
                <h2 className='title-desc'>Поиск может занять некоторое время,<br/> просим сохранять терпение.</h2>
            </div>            
            <div>
                <img className='results-page__illustration' src={process.env.PUBLIC_URL + '/searchresult.svg'} alt="searchresult_pic" />
            </div>
        </div>

        <div className='summary-report'>
          <h3 className='summary-report__desc'>Общая сводка</h3>
          {isLoadingCarousel ? (
            <p className='summary-report__result'>Идет загрузка...</p>
          ) : (
            foundCount !== null && (
              <p className='summary-report__result'>Найдено {foundCount} вариантов</p>
            )
          )}
        </div>

              {/* Сводка с гистограммой (карусель) */}
                <CarouselComponent cardsContent={cardsContentArray} isLoading={isLoadingCarousel}/>

                <div className='title-list-doc'>
                  <h3>
                    Список документов
                  </h3>
                </div>


                  {/* Результаты поиска (карточки публикаций) */}
                  <div className="results-list">
                  {parsedData && Array.isArray(parsedData) ? (
                    parsedData.slice(0, publicationsPerPage).map((item, index) => (
                        <div className="result-card" key={index}>
                          <div className="result-header">
                          <span className="publication-date">{formatDate(item.ok.issueDate)}</span>

                            {item.ok.source && (
                              <a
                                href={item.ok.source.url} // Используйте URL из вашего объекта source
                                target="_blank"
                                rel="noopener noreferrer"
                                className="source-link"
                              >
                                {item.ok.source.name}
                              </a>
                            )}
                          </div>

                          <h2 className="publication-title">{item.ok.title ? item.ok.title.text : 'Заголовок не найден'}</h2>

                  {/* Теги публикации */}
                  <div className="tags">
                    {(item.ok.attributes && (item.ok.attributes.isTechNews || item.ok.attributes.isAnnouncement || item.ok.attributes.isDigest)) ? (
                      <>
                        {item.ok.attributes.isTechNews && <span className="tag-tech-news">Технические новости</span>}
                        {item.ok.attributes.isAnnouncement && <span className="tag-announcement">Анонсы и события</span>}
                        {item.ok.attributes.isDigest && <span className="tag-digest">Сводки новостей</span>}
                      </>
                    ) : (
                      <span className="tag-tech-news">Технические новости</span>
                    )}
                  </div>



                    <div className="publication-content">
                  {/* Текст публикации и изображение (изображение перед текстом) */}
                  {item.ok.content && item.ok.content.markup && (
                    <div className='illustr-cont'>
                      {item.ok.content.markup.includes('data-andropov-type="image"') && (
                        <img className='pic_card'
                          src={item.ok.content.markup.match(/data-image-src="([^"]+)"/)[1]}
                          alt="Изображение"
                        />
                      )}
                      <p className='content'>{removeHTMLTags(extractTextFromXML(item.ok.content.markup))}</p>
                    </div>
                  )}
                </div>



                    <div className="result-footer">
                    {item.ok.url ? (
              <a
                href={item.ok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link__main"
              >
                Читать в источнике
              </a>
            ) : (
              <p>Источник не найден &#128542;</p>

            )}

          <span className="word-count">
            {/* Проверяем наличие item.attributes и item.attributes.wordCount перед чтением */}
            {item.ok.attributes && item.ok.attributes.wordCount !== undefined ? (
              `${item.ok.attributes.wordCount} слова`
            ) : (
              'Количество слов не найдено'
            )}
          </span>
        </div>
      </div>
    ))
  ) : (
    <div>Нет данных для отображения</div>
  )}
</div>



{/* Кнопка "Показать больше" */}
    <div className='butt-cont'>
      {loadMoreVisible && (
        <button className="load-more" onClick={loadMorePublications}>
          Показать больше
        </button>
      )}
    </div>


    </div>
  );
};

export default ResultsPage;
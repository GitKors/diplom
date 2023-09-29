// Функция для выполнения запроса на поиск публикаций
export async function fetchSearchResults(token: string, inn: string, startDate: string, endDate: string) {
  const searchEndpoint = 'https://gateway.scan-interfax.ru/api/v1/objectsearch';

  try {
    const payload = {
      issueDateInterval: {
        startDate: `${startDate}`,
        endDate: `${endDate}`,
      },
      searchContext: {
        targetSearchEntitiesContext: {
          targetSearchEntities: [
            {
              type: 'company',
              sparkId: null,
              entityId: null,
              inn: inn, 
              maxFullness: true,
              inBusinessNews: null,
            },
          ],
          onlyMainRole: true,
          tonality: 'any',
          onlyWithRiskFactors: false,
          riskFactors: {
            and: [],
            or: [],
            not: [],
          },
          themes: {
            and: [],
            or: [],
            not: [],
          },
        },
        themesFilter: {
          and: [],
          or: [],
          not: [],
        },
      },
      searchArea: {
        includedSources: [],
        excludedSources: [],
        includedSourceGroups: [],
        excludedSourceGroups: [],
      },
      attributeFilters: {
        excludeTechNews: true,
        excludeAnnouncements: false,//true
        excludeDigests: true,
      },
      similarMode: 'duplicates',
      limit: 1000,
      sortType: 'sourceInfluence',
      sortDirectionType: 'desc',
      intervalType: 'month',
      histogramTypes: ['totalDocuments', 'riskFactors'],
    };

    const response = await fetch(searchEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Произошла ошибка при выполнении запроса:', error);
    throw error;
  }
}

// Функция для выполнения запроса на получение статистики
export async function fetchStatistics(token: string, inn: string, startDate: string, endDate: string) {
  const searchEndpoint = 'https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms';

  try {
    const payload = {
      issueDateInterval: {
        startDate: `${startDate}`,
        endDate: `${endDate}`,
      },
      searchContext: {
        targetSearchEntitiesContext: {
          targetSearchEntities: [
            {
              type: 'company',
              sparkId: null,
              entityId: null,
              inn: inn, 
              maxFullness: true,
              inBusinessNews: null,
            },
          ],
          onlyMainRole: true,
          tonality: 'any',
          onlyWithRiskFactors: false,
          riskFactors: {
            and: [],
            or: [],
            not: [],
          },
          themes: {
            and: [],
            or: [],
            not: [],
          },
        },
        themesFilter: {
          and: [],
          or: [],
          not: [],
        },
      },
      searchArea: {
        includedSources: [],
        excludedSources: [],
        includedSourceGroups: [],
        excludedSourceGroups: [],
      },
      attributeFilters: {
        excludeTechNews: true,
        excludeAnnouncements: true,
        excludeDigests: true,
      },
      similarMode: 'duplicates',
      limit: 1000,
      sortType: 'sourceInfluence',
      sortDirectionType: 'desc',
      intervalType: 'month',
      histogramTypes: ['totalDocuments', 'riskFactors'],
    };

    const response = await fetch(searchEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Произошла ошибка при выполнении запроса:', error);
    throw error;
  }
}

// запрос на получение публикаций 
export async function fetchDocumentsByIds(token: string, ids: string[]) {
  const documentsEndpoint = 'https://gateway.scan-interfax.ru/api/v1/documents';

  try {
    const payload = {
      ids: ids,
    };

    const response = await fetch(documentsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Произошла ошибка при выполнении запроса на получение документов:', error);
    throw error;
  }
}


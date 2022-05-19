import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [table, setTable] = useState([])
  const [search, setSearch] = useState("")
  const [sort, setSorted] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [dataPerPage] = useState(10)


  // получаем с сервера данные
  useEffect(() => {
   listingTableData()
  }, [])

  async function listingTableData() {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts")
    setTable(response.data)
  }

  // фильтрация по поиску
  const tableFilter = table.filter(item => {
    if (search === "") {
      return item
    } else if (item.id.toString().includes(search)
      || item.title.toLowerCase().includes(search.toLowerCase())
      || item.body.toLowerCase().includes(search.toLowerCase())) {
      return item
    }
    return false
  })

  // кнопки сортировки
  const sortHandler = (field) => {
    if (sort === null) {
      const sorted = [...table].sort((prev, next) => 
        (prev[field].toString().toLowerCase() > next[field].toString().toLowerCase()) -
        (prev[field].toString().toLowerCase() < next[field].toString().toLowerCase())
      )
      setTable(sorted)
      setSorted(null)
    }
  }

  // пагинация
  const lastTableIndex = currentPage * dataPerPage
  const firstTableIndex = lastTableIndex - dataPerPage
  const currentTableList = tableFilter.slice(firstTableIndex, lastTableIndex)

  const paginate = pageNumber => setCurrentPage(pageNumber)

  const prevPage = () => {
    if (currentPage !== 1) {
    setCurrentPage(page => page - 1)
    }
  }
  
  const nextPage = () => {
    if (currentPage !== pageNumbers.length) {
      setCurrentPage(page => page + 1)
    }
  }

  const pageNumbers = []
  for (let i =1; i <= Math.ceil(tableFilter.length / dataPerPage); i++) {
    pageNumbers.push(i)
  }

  // рендер
  return (
    <div className='App'>
      <div>
        <input className='search' type={'text'} placeholder={"Поиск"}
        onChange={e => {setSearch(e.target.value)}}></input>
      </div>

      <div>
        <table className='table'>
          <thead className='table-columns'>
            <tr>
              <th className='table-id' onClick={() => sortHandler("id")}>ID</th>
              <th className='table-head' onClick={() => sortHandler("title")}>Заголовок</th>
              <th className='table-descr' onClick={() => sortHandler("body")}>Описание</th>
            </tr>
          </thead>
          <tbody className='table-items'>{currentTableList.map((item, key) => (
            <tr  key={key}> 
              <td className='text-id'>{item.id}</td>
              <td className='text-title'>{item.title}</td>
              <td className='text-body'>{item.body}</td>
            </tr>
          ))}
          </tbody>   
        </table>
      </div>

      <div>
        <ul className='pagination'>
          {
            pageNumbers.map(number => (
              <li className='page-item' key={number}>
                <a href='!#' className='page-link' onClick={() => paginate(number)}>{number}</a>
              </li>
            ))
          }
        </ul>
      </div>

      <button className='btn-back' onClick={prevPage}>Назад</button>
      <button className='btn-next' onClick={nextPage}>Далее</button>
    </div>
  );
}

export default App;

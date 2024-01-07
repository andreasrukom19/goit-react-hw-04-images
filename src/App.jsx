import { Searchbar } from 'components/Searchbar/Searchbar';
import React, { useState, useEffect } from 'react';
import { onDataSearch } from 'services/api';
import Notiflix from 'notiflix';
import { Loader } from 'components/Loader/Loader';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

export const App = () => {
  const [dataImages, setDataImages] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    if (searchValue) {
      fetchImagesByQuery(page, searchValue).then(data => {
        setDataImages(prevDataImages =>
          prevDataImages ? [...prevDataImages, ...data.hits] : data.hits
        );
      });
    }
  }, [searchValue, page]);

  const onSubmitForm = formData => {
    if (formData.inputValue === searchValue) {
      Notiflix.Notify.warning('You are making a similar request!', {
        position: 'center-top',
        width: '400px',
        fontSize: '16px',
      });
      return;
    }

    setSearchValue(formData.inputValue);
    setDataImages(null);
    setPage(1);
  };

  const fetchImagesByQuery = async (page, searchValue) => {
    try {
      setStatus('pending');
      const requestData = await onDataSearch(page, searchValue);
      setStatus('resolved');
      setLoading(page < Math.ceil(requestData.totalHits / 12));
      return requestData;
    } catch (error) {
      setError(error.message);
      setStatus('rejected');
    }
  };

  const onLoadMore = () => {
    setPage(page + 1);
  };

  const handleShowImage = selectId => {
    const selectedImg = dataImages.find(image => image.id === selectId);

    setIsOpenModal(true);
    setModalData(selectedImg);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const paramsMessage = {
    distance: '70px',
    fontSize: '18px',
    width: '400px',
    position: 'center-top',
  };

  return (
    <div>
      <Searchbar onSubmit={onSubmitForm} />
      {error && Notiflix.Notify.failure('Oops, the image cannot be loaded')}
      {Array.isArray(dataImages) &&
        dataImages.length === 0 &&
        Notiflix.Notify.info(
          'Nothing was found for your request',
          paramsMessage
        )}
      <ImageGallery images={dataImages} handleShowImage={handleShowImage} />
      {status === 'pending' && <Loader />}
      {Array.isArray(dataImages) && dataImages.length > 0 && loading && (
        <Button onLoadMore={onLoadMore} />
      )}
      {isOpenModal && (
        <Modal modalData={modalData} handleCloseModal={handleCloseModal} />
      )}
    </div>
  );
};

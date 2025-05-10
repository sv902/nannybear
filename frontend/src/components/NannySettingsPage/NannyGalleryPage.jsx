import React, { useRef, useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import VariantHeaderNanny from "../../components/Header/VariantHeaderNanny";
import Footer from "../../components/Footer/Footer";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";
import BearPlaceholder from "../../components/BearPlaceholder/BearPlaceholder";
import "../../styles/settings.css";

const MAX_PHOTOS = 8;

const NannyGalleryPage = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const [video, setVideo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [initialVideo, setInitialVideo] = useState(null);
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const videoInputRef = useRef(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    axios.get("/api/nanny/profile").then((res) => {
      const profile = res.data.profile;
      if (profile.video) {
        const videoUrl = `${baseUrl}/storage/${profile.video}`;
        setVideo(videoUrl);
        setInitialVideo(videoUrl);
      }
      if (Array.isArray(profile.gallery)) {
        const loadedPhotos = profile.gallery.map((photo) => `${baseUrl}/storage/${photo}`);
        setPhotos(loadedPhotos);
        setInitialPhotos(loadedPhotos);
      }
    });
  }, [baseUrl]);

  const handleVideoChange = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handlePhotoChange = (e) => {
    const newPhotos = Array.from(e.target.files).slice(0, MAX_PHOTOS - photos.length);
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const triggerVideoInput = () => {
    videoInputRef.current.click();
  };

  const triggerPhotoInput = () => {
    photoInputRef.current.click();
  };

  const handleRemoveVideo = () => {
    setVideo(null);
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const isChanged = () => {
    const videoChanged = video !== initialVideo;
    const photosChanged = JSON.stringify(photos) !== JSON.stringify(initialPhotos);
    return videoChanged || photosChanged;
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (video instanceof File) formData.append("video", video);
    photos.forEach((photo, index) => {
      if (photo instanceof File) {
        formData.append(`gallery[${index}]`, photo);
      }
    });

    try {
      await axios.post("/api/nanny/profile", formData);
      setInitialVideo(video);
      setInitialPhotos(photos);
      setShowSavedModal(true);
    } catch (err) {
      alert("Помилка при збереженні файлів");
    }
  };

  const handleSavedModalClose = () => {
    setShowSavedModal(false);
    navigate("/nanny/profile/edit");
  };

  return (
    <div>
      <VariantHeaderNanny />
      <div className="edit-page-container">
        <button
          onClick={() => (isChanged() ? setShowUnsavedModal(true) : navigate(-1))}
          className="back-button-dark"
        >
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="settings-title-pag">Галерея</h1>

        <div className="gallery-container">
          <div className="heder-gallery-text" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>Відео-візитка</strong>
              <span>Макс. 60 сек</span>
            </div>
            <div className="video-wrapper" style={{ width: "417px", height: "740px", borderRadius: "20px", backgroundColor: "#EBE6DB", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
              {video ? (
                <>
                  <video width="417" height="740" style={{ borderRadius: "20px" }} controls>
                    <source src={video instanceof File ? URL.createObjectURL(video) : video} type="video/mp4" />
                    Ваш браузер не підтримує відео.
                  </video>
                </>
              ) : (
                <BearPlaceholder />
              )}
            </div>
            <div className="gallery-btn-conyainer">
              {!video ? (
                <button className="add-gallery-btn" onClick={triggerVideoInput}>
                  Додати ВІДЕО
                </button>
              ) : (
                <button className="add-gallery-btn" onClick={handleRemoveVideo}>
                  Видалити ВІДЕО
                </button>
              )}
            </div>
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleVideoChange}
              style={{ display: "none" }}
            />
          </div>

          <div>
            <div className="heder-gallery-text" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>ФОТО</strong>
              <span>Макс. 8</span>
            </div>
            <div className="photo-section" style={{ width: "425px", minHeight: "1071px", backgroundColor: "#EBE6DB", borderRadius: "20px", padding: "10px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", position: "relative" }}>
              {photos.length > 0 ? (
                photos.map((photo, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img
                      src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                      alt={`Фото ${i + 1}`}
                      style={{ width: "196px", height: "249px", borderRadius: "10px", objectFit: "cover" }}
                    />
                    <button
                      className="remove-media-btn"
                      onClick={() => handleRemovePhoto(i)}
                      style={{ position: "absolute", top: 5, right: 5 }}
                    >✖</button>
                  </div>
                ))
              ) : (
                <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <BearPlaceholder />
                </div>
              )}
            </div>
            <div className="gallery-btn-conyainer">
              {photos.length < MAX_PHOTOS && (
                <button className="add-gallery-btn" onClick={triggerPhotoInput}>
                  Додати ФОТО
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={photoInputRef}
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="save-btn-cont">
          <button className="save-btn" onClick={handleSave}>
            ЗБЕРЕГТИ ЗМІНИ
          </button>
        </div>

        {showUnsavedModal && <UnsavedChangesModal onClose={() => setShowUnsavedModal(false)} onExit={() => navigate(-1)} />}
        {showSavedModal && <SavedChangesModal onClose={handleSavedModalClose} />}        
      </div>
      <Footer />
    </div>
  );
};

export default NannyGalleryPage;
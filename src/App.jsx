import React from "react";
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import MainPage from "./pages/MainPage";
import ProjectPage from "./pages/ProjectPage";
import PublicGallery from "./pages/PublicGalleryPage";
import ImportProject from "./components/ImportProject.jsx";
import CreateProject from "./components/CreateProject.jsx";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/project/:id" element={<ProjectPage/>}/>
                <Route path="/gallery" element={<PublicGallery/>}/>
                <Route path="/import" element={<ImportProject/>}/>
                <Route path="/create" element={<CreateProject/>}/>
            </Routes>
        </BrowserRouter>
    );
}












// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import CreateProject from './components/CreateProject.jsx'; // rename your original App if needed
// import MainPage from './pages/MainPage.jsx';
//
// export default function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<MainPage />} />
//                 <Route path="/create" element={<CreateProject />} />
//             </Routes>
//         </Router>
//     );
// }

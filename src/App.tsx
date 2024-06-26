// import TokenTransferor from './Components/react-app-env';
// import Token from "./Components/Token"
import { Dashboard } from "./Pages/Dashboard";
import { Route,Routes,BrowserRouter } from 'react-router-dom';
import { Escrow } from "./Pages/Escrow";
import { chainData } from "./utils/chainData";
import { tokens } from "./utils/Tokens";
import WalletConnect from "./Components/WalletConnet"
import MyDataTransferComponent from './Pages/DataTransfer';
import SourceMinterPage from "./Pages/SourceMinterPage.tsx";

function App() {
  return (
    <>
      
      <BrowserRouter >
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/escrow"   element={<Escrow chainData={chainData}  tokens={tokens} />} />
          <Route path="/dataTransfer" element={<MyDataTransferComponent />} />
          <Route path="/mintNFT" element={<SourceMinterPage chainData={chainData} tokens={tokens} />} />


        </Routes>
      </BrowserRouter>

     </>
  );
}

export default App;

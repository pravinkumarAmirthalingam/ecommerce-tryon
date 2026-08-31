import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Upload, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { productAPI, tryOnAPI } from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Try-On State
  const [userImageFile, setUserImageFile] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(null);
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productAPI.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleTryOn = async () => {
    if (!userImageFile || !product) return;
    
    setIsTryingOn(true);
    setError(null);
    setTryOnResult(null);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('user_image', userImageFile);
      formData.append('product_id', product.id);

      // Call API
      const resultJsonStr = await tryOnAPI.processTryOn(formData);
      
      // The API returns the string output from Flask, which is a JSON string.
      const resultObj = typeof resultJsonStr === 'string' ? JSON.parse(resultJsonStr) : resultJsonStr;
      
      // Flask returns something like "outputs/result_xxx.jpg"
      // We know Flask runs on localhost:5000 and we added the /outputs route
      if (resultObj.output_image_path) {
        setTryOnResult(`http://localhost:5000/${resultObj.output_image_path}`);
      } else {
        setError("Failed to process virtual try-on.");
      }
      
    } catch (err) {
      console.error(err);
      setError(`An error occurred: ${err.message || err}`);
    } finally {
      setIsTryingOn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-bg flex justify-center items-center">
        <div className="w-12 h-12 border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg py-8 flex justify-center">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6">
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-luxury-textSecondary hover:text-white transition-colors mb-6 text-xs uppercase tracking-widest font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </button>

        {/* 3-Column Layout: Image 1 | Image 2 (Output) | Details & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_400px] gap-6 items-start">
          
          {/* COLUMN 1: Original Product Image */}
          <div className="w-full h-[500px] lg:h-[650px] rounded-lg overflow-hidden bg-[#111] border border-gray-900 shadow-md">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* COLUMN 2: Virtual Try-On Output */}
          <div className="w-full h-[500px] lg:h-[650px] rounded-lg overflow-hidden bg-[#0a0a0a] border border-gray-900 shadow-md relative group">
            {tryOnResult && !isTryingOn ? (
              <img 
                src={tryOnResult} 
                alt="Try-On Result" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full rounded-lg border border-dashed border-gray-800 flex flex-col items-center justify-center p-6 text-center">
                {isTryingOn ? (
                  <>
                    <div className="w-10 h-10 border-2 border-gray-700 border-t-luxury-gold rounded-full animate-spin mb-4"></div>
                    <p className="text-luxury-gold tracking-widest uppercase text-sm animate-pulse">
                      Processing AI...
                    </p>
                    <p className="text-gray-500 text-xs mt-2 max-w-[200px] leading-relaxed">
                      Blending garment onto your photo
                    </p>
                  </>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-gray-700 mb-4 opacity-50" />
                    <p className="text-gray-600 tracking-widest uppercase text-xs font-medium">
                      Try On Output Here
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* COLUMN 3: Product Details & Controls */}
          <div className="flex flex-col gap-6 w-full max-w-full mx-auto lg:mx-0">
            
            {/* Product Details */}
            <div className="flex flex-col border-b border-gray-800 pb-6">
              <h1 className="text-2xl lg:text-3xl font-medium text-white tracking-wide mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xl lg:text-2xl text-luxury-gold tracking-widest font-semibold">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-gray-500 line-through text-sm">
                  ${(Number(product.price) * 1.37).toFixed(2)}
                </span>
                <span className="text-green-500 text-xs font-medium tracking-wide">
                  (37% OFF)
                </span>
              </div>
              <p className="text-[11px] text-green-500/80 mb-6 font-medium tracking-wider uppercase">inclusive of all taxes</p>

              <div className="flex items-center gap-8 mb-2">
                 {product.size && (
                   <div>
                     <p className="text-xs font-semibold text-white uppercase tracking-widest mb-3">Select Size</p>
                     <div className="flex gap-3">
                       {/* Mock size bubbles based on Myntra */}
                       {['S', 'M', 'L', 'XL'].map(size => (
                         <button key={size} className={`w-12 h-12 rounded-full border flex items-center justify-center text-xs font-medium transition-colors ${size === product.size ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/10' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                           {size}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            </div>

            {/* Virtual Try-On Box */}
            <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] rounded-lg p-5 border border-gray-800 shadow-md">
              <h3 className="text-sm font-medium text-white uppercase tracking-widest mb-2 flex items-center">
                <Camera className="w-4 h-4 mr-2 text-luxury-gold" />
                Virtual Try-On
              </h3>
              <p className="text-xs text-luxury-textSecondary mb-4 leading-relaxed">
                Upload a photo of yourself to see how this piece looks on you.
              </p>

              {error && (
                <div className="mb-4 p-3 border border-red-900/50 bg-red-900/10 text-red-400 text-xs rounded">
                  {error}
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              {!userImagePreview ? (
                <button 
                  onClick={triggerFileInput}
                  className="w-full border-2 border-dashed border-gray-700 hover:border-luxury-gold hover:bg-luxury-gold/5 rounded-lg p-5 flex flex-col items-center justify-center transition-all group min-h-[140px]"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 group-hover:bg-luxury-gold/20 flex items-center justify-center mb-3 transition-colors">
                    <Upload className="w-4 h-4 text-gray-400 group-hover:text-luxury-gold transition-colors" />
                  </div>
                  <span className="text-gray-400 uppercase tracking-widest text-[10px] font-medium group-hover:text-luxury-gold transition-colors">
                    Upload Your Photo
                  </span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border border-gray-800 bg-black/50 rounded-lg">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-700">
                      <img src={userImagePreview} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-xs font-medium flex items-center">
                        <CheckCircle2 className="w-3 h-3 text-green-500 mr-1.5" />
                        Ready for Try-On
                      </p>
                      <button onClick={triggerFileInput} className="text-[10px] text-luxury-gold hover:underline mt-1 uppercase tracking-wider">
                        Change photo
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleTryOn}
                    disabled={isTryingOn}
                    className={`w-full py-3.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center rounded
                      ${isTryingOn 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                        : 'bg-luxury-gold text-black hover:bg-[#d4b97a] shadow-[0_0_15px_rgba(200,169,106,0.2)]'
                      }`}
                  >
                    {isTryingOn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      'Try It On Now'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

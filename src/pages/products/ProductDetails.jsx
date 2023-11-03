import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import LayoutBase from '../../layout/LayoutBase';
import sinImagen from '../../assets/sin-imagen.png';
import { converterPrice } from '../../utils/ converter';
import Sliders from '../../components/Sliders';
import { useUserContext } from '../../context/UserContext';
import { useFetch } from '../../hooks/useFetch';
import { endPoints } from '../../services/endPoints/endPoints';
import CardPoster from '../../components/card/poster/CardPoster';

const ProductDetails = () => {
    
    const productName = useParams();
    const data = useLocation();
    const product = data.state;
    const price = parseInt(product.net_price);

    const {onAddProduct, cart} = useUserContext();

     // load data //
    const urlCategorie = `${endPoints.products.getProducts}?exclude=true&category=${product.category.id}`;
    const { data:dataProduct, loadingData,loading } = useFetch(urlCategorie);

    return (
        <LayoutBase>
            <section className='w-full mt-6 p-4 flex shadow-sm md:flex-row flex-col'>
                <div className='md:w-2/3 w-full'>
                    <picture className='w-full flex justify-center items-center'>
                        <img 
                            src={product.images?.length > 0 
                                ? product?.images
                                : sinImagen} 
                            alt={product.name}
                            className='h-80 w-80' />
                    </picture>
                </div>

                <div className='md:w-3/6 w-full md:border-l-2 p-4 gap-2 flex flex-col'>
                    <h2 className='text-lg text-text-gray font-semibold'>{product.name}</h2>
                    <p className='text-text-blue font-bold'>$ {converterPrice(price)}</p>
                    <div className='flex gap-4 items-center'>

                        {
                            cart.some(item => item.id === product.id) ? <button  type="button" className="bg-background-blue text-text-ligth py-1 px-2 rounded mt-4 hover:bg-background-blueHover disabled active:scale-95">Agregado al carrito</button> : <button  type="button" className='bg-background-blue text-text-ligth py-1 px-2 rounded mt-4 hover:bg-background-blueHover active:scale-95' onClick={() => onAddProduct (product)}>Agregar al carrito</button>
                        }
                        
                        <button className='flex items-center justify-center'>
                            <FontAwesomeIcon icon={faWhatsapp} className='h-8 w-8 text-green-500 mt-2 hover:text-green-800'/>
                        </button>
                    </div>
                    <div className='flex flex-col gap-2 mt-4'>
                        <h3 className='font-bold text-md'>Descripción Técnica</h3>
                        <p>-Marca del vehículo: <span className='font-light'>{product.mark_model?.mark.name}</span></p>
                        <p>-Modelo: <span className='font-light'>{product.mark_model?.name}</span></p>
                        <p>-Transmisión: <span className='font-light'>{product.transmission}</span></p>
                        <p>-Descripción: <span className='font-light'>{product.description}</span></p>
                    </div>
                </div>        
            </section>

            <section className='m-2 p-2'>
                <h3 className='font-bold my-4'>Información del producto</h3>
                <p className='font-ligth'>Compra en Autopartes Radcars. La mejor opción en repuestos y autopartes para tu vehículo. Nuestra tienda cuenta con repuestos originales y homologados de las principales marcas de vehículos: Chevrolet, Mazda, Ford, Hyundai, Kia, Renault, Volkswagen, Nissan, Suzuki, Isuzu. ENVÍOS A TODO EL PAIS ✈️ 🌍. aplican resticciones en tarifas. despacho inmediato y sin recargo. LÍNEA DE ATENCIÓN: WhatsApp 📲 321 698 8321 CAMBIOS, DEVOLUCIONES Y GARANTÍAS: Estos productos tienen una garantía de tres meses calendario (90 días), partes eléctricas y bombas de gasolina una garantía de diez (10) días calendario. Para baterías La garantía se aplica conforme se establece en el certificado de garantia entregado junto con la batería en el momento de la compra. Los productos deben presentarse en su empaque original y sin instalación previa en el vehículo. No presentar deterioro, rayones, fisuras, ni alteración de ningún tipo. Comunícate con nuestra línea de atención para programar tu cambio o devolución. Encuentra también tus autopartes de: accesorios, caja y transmisión, carrocería, clutch, correas, dirección y suspensión, eléctricos, filtración, frenado, iluminación, lubricantes, motor, refrigeración.</p>
            </section>

            <CardPoster />
            <h3 className='text-lg text-text-gray font-bold mt-6'>También te puede interesar</h3>
            <section className='w-full bg-background-blue py-8 flex px-6 my-6 '>
                
                <Sliders url={urlCategorie} data={dataProduct} loadingData={loadingData} loading={loading}/>

            </section>
        </LayoutBase>
    );
};

export default ProductDetails;


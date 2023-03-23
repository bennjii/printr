import ReactMapboxGl, { Layer, Feature, Image as ImageMBGL } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { svg } from './pin';

export const Map = () => {
    const Map = ReactMapboxGl({
        accessToken: 'pk.eyJ1IjoiYmVud2hpdGUyMiIsImEiOiJjbGZrcjNxc3IwZGp6M3VzN2FrMWwycWF6In0.7l7xKqrAsg237rv8FzdplA',
    });

    const image = new Image();
    image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg);
    const images: any = ['londonCycle', image];

    return (
        <div className="overflow-hidden rounded-md">
            <Map
                style="mapbox://styles/mapbox/streets-v9"
                containerStyle={{
                    height: '350px',
                    width: '400px'
                }}
                center={[ 151.186344, -33.888437 ]}
                >
                <ImageMBGL id={'marker-15'} data="./img/unsure.svg" />

                <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }} images={images}>
                    <Feature coordinates={[ -33.888437, 151.186344 ]} />
                </Layer>
            </Map>
        </div>
    )
}
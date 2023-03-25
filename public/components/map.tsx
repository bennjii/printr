import ReactMapboxGl, {Layer, Feature, Image as ImageMBGL, Marker} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '~/styles/pin.module.css'
import "mapbox-gl/dist/mapbox-gl.css";
import {createRef, useEffect, useState} from "react";

import mapboxgl from "mapbox-gl";

interface MapboxMapProps {
    initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
    onMapLoaded?(map: mapboxgl.Map): void;
    onMapRemoved?(): void;
}

export const Map = ({ initialOptions = {}, onMapLoaded, onMapRemoved }: MapboxMapProps) => {
//    const MBMap = ReactMapboxGl({
//        accessToken: 'pk.eyJ1IjoiYmVud2hpdGUyMiIsImEiOiJjbGZrcjNxc3IwZGp6M3VzN2FrMWwycWF6In0.7l7xKqrAsg237rv8FzdplA',
//    });

    const [map, setMap] = useState<mapboxgl.Map>();
    const mapNode = createRef();

    useEffect(() => {
        const node = mapNode.current;
        // if the window object is not found, that means
        // the component is rendered on the server
        // or the dom node is not initialized, then return early
        if (typeof window === "undefined" || node === null) return;

        // otherwise, create a map instance
        const mapboxMap = new mapboxgl.Map({
            container: node,
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            style: "mapbox://styles/mapbox/streets-v9",
            center: [151.186344, -33.888437],
            zoom: 11,
            ...initialOptions,
        });

        setMap(mapboxMap);

        new mapboxgl.Marker().setLngLat([151.186344, -33.888437]).addTo(mapboxMap);

        // if onMapLoaded is specified it will be called once
        // by "load" map event
        if (onMapLoaded) mapboxMap.once("load", onMapLoaded);

        // removing map object and calling onMapRemoved callback
        // when component will unmout
        return () => {
            mapboxMap.remove();
            if (onMapRemoved) onMapRemoved();
        }
    }, []);

    //    const image = new Image();
    //    image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg);
    //    const images: any = ['marker-15', image];

    //    console.log("Loaded Images", images);

    return (
            <div ref={mapNode} style={{ width: "100%", height: "100%" }} />
    )
//        <div className="overflow-hidden rounded-md">
//            <MBMap
//                style="mapbox://styles/mapbox/streets-v9"
//                containerStyle={{
//                    height: '350px',
//                    width: '400px'
//                }}
//                center={[ 151.186344, -33.888437 ]}
//                >
//
//                <Marker coordinates={[-33.85416325, 151.20916583]} anchor="bottom">
//                    <div className={styles.mapMarkerStyle} />
//                </Marker>
//
//                {/*
//                <Marker
//                    latitude={-33.85416325}
//                    longitude={151.20916583}
//                    // coordinates={[-33.85416325, 151.20916583]}
//                    anchor="bottom">
//                    <div style={{ width: "15px", height: "15px", borderRadius: "555px", background: "red" }}></div>
//                    <Image alt="" src="https://www.pinclipart.com/picdir/middle/174-1747068_map-marker-clip-art.png"/>
//                </Marker>
//
//
//                <ImageMBGL id={'marker-15'} data="./img/unsure.svg" />
//
//                <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
//                    <Feature coordinates={[ 151.186344, -33.888437 ]} />
//                </Layer>
//                */}
//            </MBMap>
//        </div>
//    )
}
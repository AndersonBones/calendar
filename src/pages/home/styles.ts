import { styled, Heading, Text } from "@ignite-ui/react";

export const Container = styled('div',{
    maxWidth:'calc(100vw - (100vw - 1160px) / 2)',
    display:"flex",
    alignItems:'center',
    gap:'$20',
    marginLeft:"auto",
    height:'100vh',
})

export const Hero = styled('div',{
    maxWidth:480,
    padding:"0 $10",

    [`>${Heading}`]:{
        fontWeight:600,
        color:'$white',

        "@media(max-width: 600px)":{
            fontSize:'$6xl',
        }
    },

    [`>${Text}`]:{
        marginTop:'$2',
        color:'$gray200',
        fontSize:"$xl",
    },
})

export const Preview = styled('div',{
    paddingRight:'$8',
    overflow:"hidden",

    "@media(max-width: 600px)":{
        display:'none',
    }
})
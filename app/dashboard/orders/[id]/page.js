import OrderLayout from "@/components/layouts/OrderLayout";

export default async function Page({params}){

    const test = await params;

    return(
        <OrderLayout params={test}/>
    )
}


export async function generateMetadata({ params }) {


    return {
        title: `Order ${params.id}`,
    };
}

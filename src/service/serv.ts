'use server'


export const getImages = async () => {
    const url = String(process.env.GITHUB_API_URL);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_READONLY_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        //console.log(data)
        const downloadurls = data.map((image: any) => image.download_url);
        return { images: downloadurls};
    } catch (error) {
        return { error: 'Failed to fetch data' };
    }
}

export const uploadImage = async (base64File: string, fileName: string) => {
    console.log(fileName)
    const url = `${process.env.GITHUB_API_URL}${fileName}`; // Especificar el nombre del archivo en la URL

    try {
        const response = await fetch(url, {
            method: 'PUT', // GitHub requiere PUT para subir archivos
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_ADMIN_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Add image", // Mensaje de commit obligatorio
                content: base64File.split(",")[1]  // Remover el prefijo antes de enviar a GitHub
            })
        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        return { error: 'Failed to upload image' };
    }
};
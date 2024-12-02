import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  
  // Fetch the order details based on the id or use the id to render static content
  return (
    <div>
      <h1>Order Details for Order #{id}</h1>
      {/* Add more order details here */}
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus in commodi delectus iusto! Sapiente eum non aliquid cumque laudantium molestiae consectetur. Maiores obcaecati minus ab nostrum quaerat voluptatibus deleniti eligendi?
      Delectus veritatis maxime officia quos! Eius alias obcaecati, dolore laboriosam accusamus voluptate facere repudiandae fugiat magnam modi dignissimos illo reprehenderit, eaque non, omnis asperiores quis quasi magni perspiciatis voluptates ullam.
      Sequi ut autem debitis adipisci animi maxime sapiente eligendi vel deleniti qui, ratione dolores magnam veniam voluptates iure suscipit quisquam. Esse, atque cumque. Quas odit quae praesentium quidem expedita quibusdam.
      Eum aut cupiditate enim, adipisci magni est expedita reprehenderit minima molestiae, provident recusandae quo? Doloremque iste, neque numquam quaerat odio accusantium consequatur alias officiis itaque sed molestias rerum deleniti officia?
      Deleniti, fugit dolorem mollitia porro magni possimus ea at obcaecati quae fugiat molestiae libero quia consequatur debitis deserunt aspernatur ex cumque accusantium quos. Molestias quaerat nemo mollitia suscipit recusandae nulla?
      Voluptates, fuga! Illum a doloribus nihil alias. Similique temporibus consequatur expedita! A assumenda, ratione error officia natus impedit quos aliquid necessitatibus sit, id molestias recusandae blanditiis ad laboriosam voluptas maiores.
      Repudiandae rerum ea repellat qui hic perferendis doloremque dolores nisi odit laborum quibusdam delectus omnis nulla ut esse voluptatem soluta inventore quas debitis laboriosam suscipit doloribus, in blanditiis beatae! Maiores?
      Distinctio ab voluptate omnis cum aperiam veniam maxime odit asperiores quod quibusdam ratione molestiae, sapiente iusto corrupti cumque quam reprehenderit possimus eveniet doloribus nesciunt optio! Officia consequatur aliquid in fuga!
      Assumenda quod quo laborum natus incidunt velit vitae voluptatum eaque ea est. Accusantium quibusdam accusamus eum eius minus consequuntur qui eaque perspiciatis cum in. Suscipit porro perferendis et quia repellat?</p>
    </div>
  );
};

export default OrderDetails;

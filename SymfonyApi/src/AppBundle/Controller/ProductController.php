<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use AppBundle\Entity\Product;
use AppBundle\Form\ProductType;

use JMS\Serializer\SerializerBuilder;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
/**
 * Product controller.
 *
 * @Route("/products")
 */
class ProductController extends Controller
{
    /**
     * Lists all Product entities.
     *
     * @Route("/", name="api_read_products")
     * @Method("GET")
     */
    public function indexAction(Request $request)
    {
        $pageNumber = $request->query->get('pageNumber');
        $pageSize = $request->query->get('pageSize');

        $em = $this->getDoctrine()->getManager();

        $products = $em->getRepository('AppBundle:Product')->findBy([], array('id' => 'DESC'), $pageSize, ($pageNumber-1)*$pageSize);

        $allProducts = $em->getRepository('AppBundle:Product')->findAll();

        $totalRows = count($allProducts);

        $serializer = SerializerBuilder::create()->build();

        $jsonContent = $serializer->serialize($products, 'json');

        $response = new Response();

        //$response->setContent($jsonContent);
        $response->setContent(json_encode(array(
            'products' => $jsonContent,
            'totalRows' => $totalRows
        )));

        return $response;
    }

    /**
     * Creates a new Product entity.
     *
     * @Route("/", name="product_new_or_edit")
     * @Method("POST")
     */
    public function newAction(Request $request)
    {
      $dataPost = $request->request->all();

      $response = new Response();

      $uniqueIdentifier = uniqid();

      $title = $dataPost['title'];
      $description = $dataPost['description'];
      $flowFilename = $dataPost['flowFilename'];

      $directorySave = 'images/products';

      $path = '/'.$directorySave.'/'.$uniqueIdentifier.'.'.$flowFilename;
      $imageName = $uniqueIdentifier.'.'.$flowFilename;
      $image = $request->files->get('file');
      $em = $this->getDoctrine()->getManager();

      $existProduct = $em->getRepository('AppBundle:Product')->findOneBy(['title'=> $title]);

        if ($existProduct) {
            $existProductWithId = $em->getRepository('AppBundle:Product')->findOneBy(['id' => $dataPost['id']]);
            if($existProductWithId)
            {
                //update only image
                #\Doctrine\Common\Util\Debug::dump($image);

                $product = $em->getRepository('AppBundle:Product')->findOneById($dataPost['id']);
                $imageNameProduct = $product->getImagename();
                $fs = new Filesystem();
                $fs->remove(array('symlink', 'images/products/'.$imageNameProduct));
                $product->setImagename($imageName);
                $product->setPath($path);
                $image->move($directorySave, $imageName);
                $em->persist($product);
                $em->flush();
                $serializer = SerializerBuilder::create()->build();
                $jsonProduct = $serializer->serialize($product, 'json');

                $response->setContent($jsonProduct);
                return $response;
            } else {
                $response->setStatusCode('409');
                $response->setContent('The product does exist');
                return $response;
            }
        } else {
            if($dataPost['id'] == 'undefined'){
                //create new product
                $product = new Product();
                $product->setTitle($title);
                $product->setDescription($description);
                $product->setPath($path);
                $product->setImagename($imageName);

                $em = $this->getDoctrine()->getManager();
                $em->persist($product);
                $em->flush();

                $image->move($directorySave, $imageName);

                $serializer = SerializerBuilder::create()->build();
                $jsonProduct = $serializer->serialize($product, 'json');

                $response->setContent($jsonProduct);
                return $response;
            } else {

                //update title desc with image
                $product = $em->getRepository('AppBundle:Product')->findOneById($dataPost['id']);
                $product->setTitle($title);
                $product->setDescription($description);
                $product->setPath($path);
                $product->setImagename($imageName);

                $em = $this->getDoctrine()->getManager();
                $em->persist($product);
                $em->flush();

                $image->move($directorySave, $imageName);

                $serializer = SerializerBuilder::create()->build();
                $jsonProduct = $serializer->serialize($product, 'json');

                $response->setContent($jsonProduct);
                return $response;

            }
        }
    }

    /**
     * Finds and displays a Product entity.
     *
     * @Route("/{id}", name="api_show_product")
     * @Method("GET")
     */
    public function showAction($id)
    {

      $em = $this->getDoctrine()->getManager();

      $product = $em->getRepository('AppBundle:Product')->findOneById($id);

      $serializer = SerializerBuilder::create()->build();

      $jsonProduct = $serializer->serialize($product, 'json');

      $response = new Response($jsonProduct);

      return $response;
    }

    /**
     * Displays a form to edit an existing Product entity.
     *
     * @Route("/", name="api_edit_product:")
     * @Method({"PUT", "OPTIONS"})
     */
    public function editAction(Request $request)
    {
        //update only title or desc
        $response = new Response();

        $content = json_decode($request->getContent(), true);
        $request->request->replace($content);
        $id = $content['id'];
        $newTitle = $content['title'];
        $newDescription = $content['description'];

        $em = $this->getDoctrine()->getManager();

        $existProduct = $em->getRepository('AppBundle:Product')->findOneBy(['title'=> $newTitle]);

        if ($existProduct) {
            $response->setStatusCode('409');
            $response->setContent('The product does exist');
            return $response;
        } else {
            $product = $em->getRepository('AppBundle:Product')->findOneById($id);

            $product->setTitle($newTitle);
            $product->setDescription($newDescription);

            $em->persist($product);
            $em->flush();

            $serializer = SerializerBuilder::create()->build();
            $jsonProduct = $serializer->serialize($product, 'json');

            $response->setContent($jsonProduct);
            return $response;
        }
    }

    /**
     * Deletes a Product entity.
     *
     * @Route("/{id}", name="product_delete")
     * @Method("DELETE")
     */
    public function deleteAction($id)
    {
      $em = $this->getDoctrine()->getManager();
        $product = $em->getRepository('AppBundle:Product')->findOneById($id);
        $em->remove($product);
        $em->flush();

        $imageName = $product->getImagename();

        $fs = new Filesystem();
        $fs->remove(array('symlink', 'images/products/'.$imageName));

        $response = new Response();

        return $response;
    }
}

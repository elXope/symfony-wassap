<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{JsonResponse, Response};
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Message;
use DateTimeInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Form\MessageFormType;

class MessageController extends AbstractController
{
    #[Route('/message/toUser/{toUserid}', name: 'app_message')]
    public function send(ManagerRegistry $doctrine, Request $request, $toUserid): JsonResponse
    {
        
        $message = new Message();
        $form = $this->createForm(MessageFormType::class, $message);
        $form->handleRequest($request);
        // if($form->isSubmitted() && $form->isValid()){
            $message = $form->getData();
            $message->setFromUser($this->getUser());
            $message->setTimestamp(new DateTimeInterface);
            $message->setToUser($toUserid);
            $entityManager = $doctrine->getManager();
            $entityManager->persist($message);
            $entityManager->flush();
            // Crear missage sent: JSON Response que després pillem per jquery i creem nou missatge
            $data = [
                "text" => $message->getText(),
                "timestamp" => $message->getTimestamp()
            ];
            return new JsonResponse($data, Response::HTTP_OK);
        // }
        // return new JsonResponse(null, Response::HTTP_I_AM_A_TEAPOT);
    }
}

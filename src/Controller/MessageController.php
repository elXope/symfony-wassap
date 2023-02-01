<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{JsonResponse, Response};
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Message;
use App\Entity\User;
use DateTimeInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Form\MessageFormType;
use DateTime;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class MessageController extends AbstractController
{
    #[Route('/messages/{fromUserid}/{toUserid}')]
    public function sentMessages(ManagerRegistry $doctrine, $fromUserid, $toUserid): JsonResponse
    {
        $messageRepo = $doctrine->getRepository(Message::class);
        $userRepo = $doctrine->getRepository(User::class);
        $messages = $messageRepo->findConversation($userRepo->find($fromUserid), $userRepo->find($toUserid));
        $data = [];
        foreach ($messages as $message) {
            array_push($data, [
                'id' => $message->getFromUser()->getId(),
                'text' => $message->getText(),
                'timestamp' =>$message->getTimestamp()->format('Y-m-d H:i:s')
            ]);
        }
        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/message/last/{fromUserid}/{toUserid}')]
    public function lastMessage(ManagerRegistry $doctrine, $fromUserid, $toUserid): JsonResponse
    {
        $messageRepo = $doctrine->getRepository(Message::class);
        $userRepo = $doctrine->getRepository(User::class);
        $message = $messageRepo->findLast($userRepo->find($fromUserid), $userRepo->find($toUserid));
        if($message) {
            $data = [
                'text' => $message->getText(),
                'timestamp' => $message->getTimestamp()->format('Y-m-d H:i:s')
            ];
        } else {
            $data = null;
        }
        
        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/message/toUser/{toUserid}', name: 'app_message')]
    public function send(ManagerRegistry $doctrine, Request $request, $toUserid): Response
    {
        
        $message = new Message();
        $form = $this->createForm(MessageFormType::class, $message);
        $form->handleRequest($request);
        if($form->isSubmitted()){ // NO PUC VALIDAR
            $message = $form->getData();
            $message->setFromUser($this->getUser());
            $data = new DateTime();
            $message->setTimestamp($data);
            $userRepo = $doctrine->getRepository(User::class);
            $message->setToUser($userRepo->find($toUserid));
            $entityManager = $doctrine->getManager();
            $entityManager->persist($message);
            $entityManager->flush();
            // Crear missage sent: JSON Response que després pillem per jquery i creem nou missatge
            $data = [
                "text" => $message->getText(),
                "timestamp" => $message->getTimestamp()
            ];
            return new JsonResponse($data, Response::HTTP_OK);
        }
        return $this->render('partials/_textForm.html.twig', [
            'form' => $form->createView()
        ]);
    }
}

<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Message;
use DateTimeInterface;
use Symfony\Component\HttpFoundation\Request;

class MessageController extends AbstractController
{
    #[Route('/message/toUser/{toUserid}', name: 'app_message')]
    public function send(ManagerRegistry $doctrine, Request $request, $toUserid): JsonResponse
    {
        $date = new DateTimeInterface;
        $message = new Message();
        $form = $this->createForm(MessageFormType::class, $message);
        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()){
            $message = $form->getData();
            $message->setFromUser($this->getUser());
            $message->setTimestamp($date);
            $message->setToUser($toUserid);
            $entityManager = $doctrine->getManager();
            $entityManager->persist($message);
            $entityManager->flush();
        }
        // AFEGIR JSON RESPONSE
    }
}

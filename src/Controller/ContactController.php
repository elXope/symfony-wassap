<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;


class ContactController extends AbstractController
{
    #[Route('/contacts', name: 'contacts')]
    public function contacts(ManagerRegistry $doctrine): JsonResponse
    {
        $repository = $doctrine->getRepository(User::class);
        $contacts = $repository->findAll();
        $data = [];
        for ($i=0; $i < count($contacts); $i++) { 
            $data[$contacts[$i]->getId()] = [
                "username" => $contacts[$i]->getUsername(),
                "image" => $contacts[$i]->getImage(),
            ];
        }
        return new JsonResponse($data, Response::HTTP_OK);
    }

    // #[Route('/contacts/{userId}', name: 'contacts')]
    // public function contacts(ManagerRegistry $doctrine, int $userId): JsonResponse
    // {

    // }
   
}

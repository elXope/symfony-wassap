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
    #[Route('/contacts/{userId}', name: 'contacts')]
    public function contacts(ManagerRegistry $doctrine, int $userId): JsonResponse
    {

    }
   
}

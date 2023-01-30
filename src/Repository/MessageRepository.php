<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 *
 * @method Message|null find($id, $lockMode = null, $lockVersion = null)
 * @method Message|null findOneBy(array $criteria, array $orderBy = null)
 * @method Message[]    findAll()
 * @method Message[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function save(Message $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Message $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
    * @return Message[] Returns an array of Message objects
    */
   public function findConversation($fromUser, $toUser): array
   {
       return $this->createQueryBuilder('m')
           ->andWhere('m.fromUser = :fromUser AND m.toUser = :toUser')
           ->orWhere('m.fromUser = :toUser AND m.toUser = :fromUser')
           ->setParameters(['fromUser' => $fromUser, 'toUser' => $toUser])
           ->orderBy('m.timestamp', 'ASC')
           ->getQuery()
           ->getResult()
       ;
   }

   public function findLast($fromUser, $toUser): ?Message
   {
       return $this->createQueryBuilder('m')
           ->andWhere('m.fromUser = :fromUser AND m.toUser = :toUser')
           ->orWhere('m.fromUser = :toUser AND m.toUser = :fromUser')
           ->setParameters(['fromUser' => $fromUser, 'toUser' => $toUser])
           ->orderBy('m.timestamp', 'DESC')
           ->setMaxResults(1)
           ->getQuery()
           ->getOneOrNullResult()
       ;
   }

//    /**
//     * @return Message[] Returns an array of Message objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Message
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

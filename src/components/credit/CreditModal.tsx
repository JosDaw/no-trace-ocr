'use client';
import { database } from '@/config/firebase';
import useUser from '@/store/useUser';
import { Modal, SegmentedControl, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { PayPalButtons } from '@paypal/react-paypal-js';
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { useState } from 'react';

interface CreditModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreditModal({ opened, onClose }: CreditModalProps) {
  const [purchaseAmount, setPurchaseAmount] = useState<string>('5.00');
  const updateCredit = useUser((state: any) => state.updateCredit);
  const { user } = useUser();

  return (
    <Modal opened={opened} onClose={onClose} title='Add Credit' centered>
      <>
        <Title size='lg'>Select Credit Amount</Title>
        <SegmentedControl
          fullWidth
          my={25}
          value={purchaseAmount}
          onChange={setPurchaseAmount}
          data={[
            { label: '$5', value: '5.00' },
            { label: '$10', value: '10.00' },
            { label: '$25', value: '25.00' },
            { label: '$50', value: '50.00' },
            { label: '$100', value: '100.00' },
          ]}
          radius='lg'
          size='md'
        />

        <Title size='lg' mb={25}>
          Pay Securely with PayPal
        </Title>

        <PayPalButtons
          style={{
            color: 'blue',
            shape: 'pill',
            label: 'pay',
            height: 50,
          }}
          createOrder={(data, actions) => {
            // Create payment intent
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: purchaseAmount,
                  },
                  description: 'No Trace OCR Credit',
                  soft_descriptor: 'No Trace OCR',
                },
              ],
            });
          }}
          onApprove={async (_data, actions) => {
            // Check if actions.order is defined
            if (actions.order) {
              try {
                const details = await actions.order.capture();

                // Update zustand credit
                updateCredit(user.credit + parseFloat(purchaseAmount));

                const updateRef = doc(
                  collection(database, 'user'),
                  user.userDoc.toString()
                );

                // Update credit first
                await updateDoc(updateRef, {
                  credit: user.credit + parseFloat(purchaseAmount),
                  dateUpdated: Timestamp.now(),
                }).then(async () => {
                  // Add payment record
                  await addDoc(collection(database, 'payment'), {
                    userDoc: user.userDoc,
                    amount: purchaseAmount,
                    date: Timestamp.now(),
                    paymentID: details.id,
                    type: 'paypal',
                  }).then(() => {
                    showNotification({
                      title: 'Credit Added!',
                      message: `You have successfully added $${purchaseAmount} to your account. Thank you!`,
                      color: 'green',
                    });

                    // Close modal
                    close();
                  });
                });
              } catch (error) {
                console.error(error);
                showNotification({
                  title: 'Error',
                  message:
                    'Sorry! Error after payment. Please refresh the page.',
                  color: 'red',
                });

                return await Promise.resolve();
              }
            } else {
              showNotification({
                title: 'Error',
                message: 'Sorry! PayPal order actions are not available.',
                color: 'red',
              });
              return Promise.resolve();
            }
          }}
          onError={(err) => {
            console.error(err);
            showNotification({
              title: 'Error',
              message: 'Sorry! PayPal failed. Please try again later.',
              color: 'red',
            });
            return Promise.resolve();
          }}
        />
      </>
    </Modal>
  );
}

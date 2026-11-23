'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Minus,
  Package2,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { navigate } from '@/lib/router';
import type { CheckoutResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CoinAmount,
  EmptyState,
  LoadingBlock,
  PageHeader,
  SectionTitle,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';

/** 1 -> "товар", 2 -> "товара", 5 -> "товаров" */
function pluralItems(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'товара';
  return 'товаров';
}

function CartThumb({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  return (
    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">
      {!src || error ? (
        <div className="flex h-full w-full items-center justify-center">
          <Package2 className="h-5 w-5 text-muted-foreground/70" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export default function CartPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [comment, setComment] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: api.cart.get,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const balance = user?.balance ?? 0;
  const notEnough = balance < total;

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      api.cart.update(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: (error: Error) => toast.error(error.message),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: number) => api.cart.remove(itemId),
    onSuccess: () => {
      toast.success('Товар удалён из корзины');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const checkoutMutation = useMutation({
    mutationFn: () => api.orders.checkout(comment || undefined),
    onSuccess: (result) => {
      setCheckoutResult(result);
      setSuccessOpen(true);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSuccessConfirm = () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['me'] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    setSuccessOpen(false);
    navigate('/catalog');
  };

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="side" />
      <PageContainer>
        <PageHeader
          title="Корзина"
          backHref="/catalog"
          description="Страница оформления заказа из каталога. Подсчёт общей суммы происходит автоматически."
        />

        {isLoading ? (
          <LoadingBlock />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2">
              {items.length === 0 ? (
                <EmptyState
                  icon={<ShoppingBag className="h-5 w-5" />}
                  title="Корзина пуста"
                  description="Добавьте товары из каталога"
                  action={
                    <Button onClick={() => navigate('/catalog')}>
                      Перейти в каталог
                    </Button>
                  }
                />
              ) : (
                <div className="panel divide-y divide-white/5 overflow-hidden">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4">
                      <CartThumb src={item.product.imageUrl} alt={item.product.title} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.product.title}</p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CoinAmount
                            value={item.product.price}
                            iconClassName="h-3 w-3"
                          />
                          <span>за шт.</span>
                        </div>
                        <div className="mt-2 flex w-fit items-center gap-2 rounded-full border border-white/10 px-2 py-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 rounded-full p-0"
                            disabled={item.quantity <= 1 || updateMutation.isPending}
                            onClick={() =>
                              updateMutation.mutate({
                                itemId: item.id,
                                quantity: item.quantity - 1,
                              })
                            }
                            aria-label="Уменьшить количество"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-6 text-center font-medium tabular-nums-tight">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 rounded-full p-0"
                            disabled={updateMutation.isPending}
                            onClick={() =>
                              updateMutation.mutate({
                                itemId: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                            aria-label="Увеличить количество"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <CoinAmount
                          value={item.product.price * item.quantity}
                          className="text-amber-300"
                          iconClassName="h-4 w-4"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-red-400/10 hover:text-red-400"
                          disabled={removeMutation.isPending}
                          onClick={() => removeMutation.mutate(item.id)}
                          aria-label="Удалить из корзины"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="panel h-fit p-6 lg:sticky lg:top-24">
              <SectionTitle>Описание заказа</SectionTitle>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {items.length} {pluralItems(items.length)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Итого</span>
                  <CoinAmount
                    value={total}
                    className="font-display text-2xl font-bold text-amber-300"
                    iconClassName="h-5 w-5"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Ваш баланс</span>
                  <CoinAmount
                    value={balance}
                    className={notEnough ? 'text-red-300' : 'text-emerald-300'}
                    iconClassName="h-4 w-4"
                  />
                </div>
              </div>

              {notEnough && (
                <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>
                    Не хватает{' '}
                    <CoinAmount
                      value={total - balance}
                      className="text-amber-200"
                      iconClassName="h-3.5 w-3.5"
                    />{' '}
                    коинов
                  </span>
                </div>
              )}

              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Комментарий к заказу (необязательно)"
                className="mt-5"
              />

              <Button
                size="lg"
                className="mt-5 w-full"
                disabled={
                  notEnough ||
                  items.length === 0 ||
                  checkoutMutation.isPending
                }
                title={notEnough ? 'Недостаточно коинов' : undefined}
                onClick={() => checkoutMutation.mutate()}
              >
                {checkoutMutation.isPending ? 'Оформляем...' : 'Оформить'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </PageContainer>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-sm">
          <div className="flex flex-col items-center gap-4 pt-2 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            >
              <CheckCircle2 className="h-14 w-14 text-primary" />
            </motion.div>
            <DialogTitle className="font-display text-xl font-bold">
              Заказ №{checkoutResult?.order.id ?? ''} оформлен!
            </DialogTitle>
            <DialogDescription>
              Заказ передан в обработку, результаты — в истории заказов.
            </DialogDescription>

            <div className="w-full space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Сумма заказа</span>
                <CoinAmount
                  value={checkoutResult?.order.total ?? 0}
                  className="font-display text-lg font-bold text-amber-300"
                  iconClassName="h-4 w-4"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Новый баланс</span>
                <CoinAmount
                  value={checkoutResult?.balance ?? 0}
                  className="text-emerald-300"
                  iconClassName="h-4 w-4"
                />
              </div>
            </div>

            <span className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
              +
              <CoinAmount
                value={checkoutResult?.cashback ?? 0}
                iconClassName="h-3.5 w-3.5"
              />
              коинов кэшбека вернётся на баланс
            </span>

            <Button className="w-full" onClick={handleSuccessConfirm}>
              Отлично
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

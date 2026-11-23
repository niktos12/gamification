'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Clock, Crown, Gavel } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCoins, formatDate, formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import type { Auction } from '@/lib/types';
import {
  CoinAmount,
  EmptyState,
  LoadingBlock,
  PageHeader,
  StatusBadge,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/* ------------------------------------------------------------------ */
/* Lot image with graceful fallback                                    */
/* ------------------------------------------------------------------ */

function LotImage({ auction }: { auction: Auction }) {
  const [imgOk, setImgOk] = useState(true);
  const showImage = Boolean(auction.imageUrl) && imgOk;

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
      {showImage ? (
        <img
          src={auction.imageUrl}
          alt={auction.title}
          className="h-full w-full object-cover"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 to-white/0">
          <Gavel className="h-9 w-9 text-muted-foreground/50" />
        </div>
      )}
      <StatusBadge status={auction.status} className="absolute left-3 top-3 z-10" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Auction card                                                        */
/* ------------------------------------------------------------------ */

function AuctionCard({ auction }: { auction: Auction }) {
  const queryClient = useQueryClient();
  const [bidOpen, setBidOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const isActive = auction.status === 'active';

  const bidMutation = useMutation({
    mutationFn: (value: number) => api.auctions.bid(auction.id, value),
    onSuccess: () => {
      toast.success('Ставка принята!');
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      setBidOpen(false);
      setAmount('');
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Не удалось сделать ставку');
    },
  });

  const detailQuery = useQuery({
    queryKey: ['auction', auction.id],
    queryFn: () => api.auctions.get(auction.id),
    enabled: detailOpen,
  });

  const openBidDialog = () => {
    setAmount(String(auction.currentPrice + 1));
    setBidOpen(true);
  };

  const submitBid = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= auction.currentPrice) {
      toast.error(`Минимальная ставка: ${formatCoins(auction.currentPrice + 1)} коинов`);
      return;
    }
    bidMutation.mutate(Math.floor(value));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Подробнее о лоте «${auction.title}»`}
      onClick={() => setDetailOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setDetailOpen(true);
        }
      }}
      className="panel panel-hover cursor-pointer overflow-hidden"
    >
      <LotImage auction={auction} />

      <div className="p-5">
        <h3 className="font-medium">{auction.title}</h3>
        {auction.description && (
          <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {auction.description}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Текущая ставка</p>
            <CoinAmount
              value={auction.currentPrice}
              className="mt-1 text-xl text-amber-300"
              iconClassName="h-5 w-5"
            />
          </div>
          {auction.highestBidderName && (
            <span className="inline-flex max-w-[55%] items-center gap-1.5 truncate rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-300">
              <Crown className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Лидер: {auction.highestBidderName}</span>
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          До {formatDate(auction.endsAt)}
        </div>

        <div className="mt-4">
          {isActive ? (
            <Button
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                openBidDialog();
              }}
            >
              Сделать ставку
            </Button>
          ) : (
            <Button variant="secondary" className="w-full" disabled>
              Торги завершены
            </Button>
          )}
        </div>
      </div>

      {/* --------------------------- Bid dialog -------------------------- */}
      <Dialog
        open={bidOpen}
        onOpenChange={(open) => {
          setBidOpen(open);
          if (!open) setAmount('');
        }}
      >
        <DialogContent
          className="sm:max-w-sm"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Сделать ставку</DialogTitle>
            <DialogDescription>
              Лот «{auction.title}». Ставки списываются коинами с баланса.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-muted-foreground">Текущая ставка</span>
              <CoinAmount value={auction.currentPrice} className="text-lg text-amber-300" iconClassName="h-4.5 w-4.5" />
            </div>
            <p className="text-xs text-muted-foreground">
              Минимальная ставка:{' '}
              <CoinAmount
                value={auction.currentPrice + 1}
                className="text-amber-300"
                iconClassName="h-3.5 w-3.5"
              />
            </p>
            <div className="space-y-1.5">
              <Label htmlFor={`bid-${auction.id}`}>Ваша ставка</Label>
              <Input
                id={`bid-${auction.id}`}
                type="number"
                inputMode="numeric"
                min={auction.currentPrice + 1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    submitBid();
                  }
                }}
                placeholder={`${auction.currentPrice + 1}`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBidOpen(false)}>
              Отмена
            </Button>
            <Button onClick={submitBid} disabled={bidMutation.isPending || !amount.trim()}>
              {bidMutation.isPending ? 'Отправляем...' : 'Подтвердить ставку'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------------- Detail dialog ------------------------- */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent
          className="sm:max-w-lg"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>{auction.title}</DialogTitle>
            <DialogDescription>Все подробности лота и история торгов.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{auction.description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <CoinAmount value={auction.currentPrice} className="text-amber-300" iconClassName="h-3.5 w-3.5" />
              текущая цена
            </span>
            {auction.highestBidderName && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-amber-300">
                <Crown className="h-3.5 w-3.5" />
                Лидер: {auction.highestBidderName}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              До {formatDate(auction.endsAt)}
            </span>
          </div>

          <div>
            <h4 className="mb-2 font-display text-sm font-semibold">История ставок</h4>
            <div className="panel max-h-60 overflow-y-auto" data-lenis-prevent>
              {detailQuery.isLoading ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">Загружаем ставки...</p>
              ) : (detailQuery.data?.bids?.length ?? 0) === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">Ставок пока нет</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {detailQuery.data?.bids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <span className="min-w-0 truncate text-sm">{bid.userName}</span>
                      <span className="shrink-0 text-right">
                        <CoinAmount value={bid.amount} className="text-sm text-amber-300" iconClassName="h-3.5 w-3.5" />
                        <span className="block text-xs text-muted-foreground">
                          {formatDateTime(bid.createdAt)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AuctionsPage(props: { params?: Record<string, string> }) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const auctionsQuery = useQuery({
    queryKey: ['auctions'],
    queryFn: api.auctions.list,
  });

  const auctions: Auction[] = auctionsQuery.data?.auctions ?? [];

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.auctions.create(payload),
    onSuccess: () => {
      toast.success('Лот выставлен на торги');
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      setCreateOpen(false);
      setTitle('');
      setDescription('');
      setStartPrice('');
      setEndsAt('');
      setImageUrl('');
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Не удалось создать лот');
    },
  });

  const handleCreate = () => {
    const price = Number(startPrice);
    if (!title.trim() || !Number.isFinite(price) || price <= 0 || !endsAt) {
      toast.error('Заполните название, стартовую цену и дату окончания');
      return;
    }
    const payload: Record<string, unknown> = {
      title: title.trim(),
      description: description.trim(),
      startPrice: Math.floor(price),
      endsAt,
    };
    if (imageUrl.trim()) payload.imageUrl = imageUrl.trim();
    createMutation.mutate(payload);
  };

  const canSubmit = Boolean(title.trim() && endsAt && Number(startPrice) > 0);

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="aurora" />
      <PageContainer>
        <PageHeader
          title="Аукционы"
          backHref="/room"
          description="Внутренние торги за товары из корпоративного магазина. Администратор выставляет лоты, сотрудники делают ставки коинами."
          actions={
            isAdmin ? <Button onClick={() => setCreateOpen(true)}>Создать лот</Button> : undefined
          }
        />

        {auctionsQuery.isLoading ? (
          <LoadingBlock />
        ) : auctions.length === 0 ? (
          <EmptyState
            icon={<Gavel className="h-5 w-5" />}
            title="Лотов пока нет"
            description={
              isAdmin
                ? 'Выставьте первый лот — сотрудники смогут торговаться за него коинами.'
                : 'Как только администратор выставит лоты, торги начнутся здесь.'
            }
            action={
              isAdmin ? (
                <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
                  Создать лот
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}

        {/* ------------------------- Create dialog ------------------------ */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Новый лот</DialogTitle>
              <DialogDescription>
                Лот появится в списке аукционов, и сотрудники смогут делать ставки.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="auction-title">Название</Label>
                <Input
                  id="auction-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Наушники Apple AirPods Pro"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="auction-description">Описание</Label>
                <Textarea
                  id="auction-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Что за товар и почему его стоит выиграть"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="auction-price">Стартовая цена</Label>
                  <Input
                    id="auction-price"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="auction-ends">Окончание торгов</Label>
                  <Input
                    id="auction-ends"
                    type="date"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="auction-image">Ссылка на изображение</Label>
                <Input
                  id="auction-image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (необязательно)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending || !canSubmit}
                className={cn(createMutation.isPending && 'pointer-events-none opacity-70')}
              >
                {createMutation.isPending ? 'Создаём...' : 'Выставить лот'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </div>
  );
}
